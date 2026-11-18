# Presentación web del experimento

Versión para exposición oral en 19 diapositivas. Sitio estático servido por GitHub Pages desde `main:/docs`, en `/presentacion/`.

## Uso

- Flechas del teclado o de la barra inferior para avanzar y retroceder.
- Índice para saltar a un tema; Fuentes muestra únicamente las referencias de esa diapositiva.
- Diapositiva 6: original, forward fill y FF + cero, sobre un ejemplo ilustrativo.
- Diapositiva 9: EXP1 / EXP2 y ganancia media por semilla frente a NaN.
- Diapositiva 10: EXP1 / EXP2, ganancia / AUC del ensamble; tabla completa a un clic.
- Diapositiva 11: cinco extensiones FF y tabla con p ajustados.
- Diapositiva 15: puntos de las 30 semillas reales.
- En celular se activa lectura vertical. Los gráficos de comparación se muestran como filas legibles con los mismos valores. El gráfico de semillas permite desplazamiento horizontal.
- `?lectura=1` permite lectura vertical también en una computadora.

No necesita servidor de aplicación, cuenta del visitante, ni conexiones a CDN. Incluye reveal.js 5.2.1 y su licencia MIT en `vendor/`. Los enlaces a fuentes abren sitios externos.

## Datos y alcance

`resultados.json` es una copia del JSON embebido en `docs/consolidado.html` del repositorio AgustinBerna/experimentos-colaborativos, commit `3dea9a76a3fdf2afeab1c5fee8fa620d4bfcce45`. Contiene 26 combinaciones método/familia, 780 evaluaciones por semilla y 294 contrastes. No contiene filas del dataset ni predicciones por cliente. `evidencia/procedencia.json` conserva el manifiesto publicado de fuentes y controles. La extracción se hizo con `json.loads` sobre el elemento `script#data`, sin modificar métricas.

Contenido contrastado con la presentación compartida de Google Slides al 18/11/2026 (21 diapositivas). Se condensan las tablas, bibliografía e histórico en vistas de detalle y se mantienen las limitaciones. Las dos medianas se conservan como métodos distintos. Las comparaciones entre familias son descriptivas. El sitio no atribuye significación estadística a diferencias entre ensambles.

Los p de esta presentación usan la familia ampliada del consolidado: 12 alternativas vs E0 en EXP1, 7 en EXP2 y 5 extensiones vs E4. Difieren de los informes originales del repositorio, que explicitan conjuntos de comparaciones más pequeños. La interpretación de FF + cero sigue siendo: mejora de AUC frente a E0/E4, sin evidencia concluyente de mejora de ganancia.

La auditoría de `forward_fill(limit=2)` se documenta en `auditoria.html`. El panel tiene huecos temporales; se describe el tratamiento como **dos filas**. La evidencia de cinco variables es un contraejemplo, no un total exhaustivo de celdas.

## Reproducción

Desde la raíz, con las dependencias científicas del experimento:

```sh
python analysis/verificar_presentacion.py
python analysis/verificar_presentacion.py --panel /ruta/panel_2019.parquet
python -m http.server 8765 --directory docs
```

Abrir `http://localhost:8765/presentacion/`. El script recalcula los 294 contrastes desde las métricas por semilla y verifica los 26 resúmenes. La opción `--panel` solo imprime agregados de la auditoría temporal. No reentrena modelos ni recalcula predicciones de ensambles.

Si se actualizan resultados, hay que revisar también las cifras destacadas en `index.html` y los textos de `app.js`, conservar la versión fuente y volver a verificar. Esta página representa una versión fija del trabajo.

## Clarificaciones de la presentación

La portada identifica a Agustín Bernacchia, Micaela Rocío Rodríguez y Florencia Rodríguez. La primera aparición de E0 y de EXP1/EXP2 incluye su significado completo. La diapositiva de métricas distingue el ranking completo (AUC, BAJA+1/BAJA+2) de la campaña a N fijo (ganancia, recompensa solo para BAJA+2).

Los 280 y 361 árboles proceden de selecciones independientes sobre el E0 de cada experimento. Comparar EXP1 y EXP2 no aísla el efecto de los indicadores. Queda propuesta una comparación con y sin indicadores y sus derivados usando los mismos datos, semillas, hiperparámetros, árboles y N. No se ejecutaron nuevas corridas para esta actualización editorial.
