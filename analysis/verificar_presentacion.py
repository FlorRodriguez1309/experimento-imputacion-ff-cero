"""Verifica el consolidado publicado y, opcionalmente, el límite temporal de FF.

Uso: python analysis/verificar_presentacion.py [--panel /ruta/panel_2019.parquet]
Solo imprime agregados. No publica ni modifica datos por cliente.
"""
import argparse
import collections
import json
from pathlib import Path

import numpy as np
from scipy.stats import wilcoxon

ROOT = Path(__file__).resolve().parents[1]


def verify_statistics():
    data = json.loads((ROOT / 'docs/presentacion/resultados.json').read_text())
    seeds = collections.defaultdict(dict)
    for row in data['seeds']:
        key = (row['family'], row['method'])
        assert row['seed'] not in seeds[key]
        seeds[key][row['seed']] = row
    assert len(seeds) == 26 and len(data['seeds']) == 780
    groups = collections.defaultdict(list)
    for row in data['tests']:
        a = seeds[row['family'], row['method']]
        b = seeds[row['family'], row['reference']]
        assert a.keys() == b.keys() and len(a) == 30
        metric = row['metric']
        delta = np.round([a[s][metric] - b[s][metric] for s in sorted(a)],
                         12 if metric == 'roc_auc' else 6)
        p = 1.0 if np.all(delta == 0) else float(wilcoxon(
            delta, zero_method='zsplit', alternative='two-sided', method='auto').pvalue)
        assert np.isclose(p, row['p_raw'], rtol=0, atol=1e-10), (row, p)
        assert np.isclose(delta.mean(), row['delta_mean'], rtol=0, atol=1e-6)
        groups[row['family'], row['test_family'], metric].append((p, row))
    for rows in groups.values():
        last = 0.
        for rank, (p, row) in enumerate(sorted(rows, key=lambda x: x[0])):
            last = min(1., max(last, p * (len(rows) - rank)))
            assert np.isclose(last, row['p_holm'], rtol=0, atol=1e-10)
            assert row['family_size'] == len(rows)
    for row in data['summary']:
        s = list(seeds[row['family'], row['method']].values())
        assert np.isclose(np.mean([x['gain_at_n_fijo'] for x in s]), row['gain_mean'])
        assert np.isclose(np.mean([x['roc_auc'] for x in s]), row['auc_mean'])
        assert row['baja2_ensemble'] * 1_100_000 - row['n'] * 27_500 == row['gain_ensemble']
    print('OK: 780 filas, 26 resúmenes y 294 contrastes recalculados.')
    for row in data['tests']:
        if (row['family'], row['method'], row['test_family']) == ('EXP1', 'FF_LIMIT2ROWS', 'vs_E0'):
            print(json.dumps(row, ensure_ascii=False))


def verify_calendar(panel):
    import polars as pl
    cols = ['mrentabilidad', 'mrentabilidad_annual', 'mcomisiones',
            'mactivos_margen', 'mpasivos_margen']
    id_col, month = 'numero_de_cliente', 'foto_mes'
    df = pl.read_parquet(panel, columns=[id_col, month] + cols).sort([id_col, month])
    df = df.with_columns(((pl.col(month) // 100) * 12 + pl.col(month) % 100).alias('_month'))
    gaps = df.select(pl.col('_month').diff().over(id_col).alias('gap'))['gap']
    out = dict(panel_rows=df.height, clients=df[id_col].n_unique(),
               calendar_gaps=int((gaps > 1).sum()), max_gap_months=int(gaps.max()),
               scope='Cinco variables testigo; no es un conteo exhaustivo de celdas.',
               examples_aggregate_only=[])
    for col in cols:
        check = df.with_columns(
            pl.col(col).forward_fill(limit=2).over(id_col).alias('_filled'),
            pl.when(pl.col(col).is_not_null()).then(pl.col('_month')).otherwise(None)
              .forward_fill(limit=2).over(id_col).alias('_origin'))
        check = check.with_columns((pl.col('_month') - pl.col('_origin')).alias('_age'))
        check = check.filter(pl.col(col).is_null() & pl.col('_filled').is_not_null() & (pl.col('_age') > 2))
        out['examples_aggregate_only'].append(dict(variable=col,
            n_filled_beyond_two_calendar_months=check.height,
            max_age_months=check['_age'].max(), months=sorted(check[month].unique().to_list())))
    print(json.dumps(out, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--panel', type=Path)
    args = parser.parse_args()
    verify_statistics()
    if args.panel:
        verify_calendar(args.panel)
