# Publicación del 17 de noviembre de 2026

El código base proviene de Agustín Bernacchia, commit `27d9d941f47b3b0eeaa7c724990baf5361613ce8`.

La corrida local original evaluó E0, E4, FF_ZERO y FF_MEDIAN con mediana antes de FF. Sus resultados y protocolo están en `archivo_corrida_original/`. `run_identity.json` en ese archivo corresponde a esa corrida, no al código adaptado de la publicación.

La definición del control se alineó posteriormente con Mica E10: forward fill causal, mediana del train ya transformado y relleno residual. Las 30 métricas de Mica se obtuvieron de su ZIP marzo–agosto, commit `b4f92dc83ace1a068393c661ecf71c0e9e32d73a`. La tabla actual conserva E0/E4/FF_ZERO locales y usa E10 de Mica como `FF_MEDIAN_MICA`. No se presenta esa integración como una nueva corrida local.

Los 30 valores por semilla de los baselines E0 y E4 coinciden en las métricas comprobadas. El archivo `outputs/analisis_verificado.json` contiene las comprobaciones, los hashes de los archivos fuente y los p-valores recalculados. No contiene una certificación de las predicciones individuales de Mica.

Cambios respecto del paquete original:

- Adaptación de la mediana y nombre explícito `FF_MEDIAN_MICA`.
- Prueba del orden FF/mediana y de exclusión de datos futuros.
- Protocolo actualizado con fecha y carácter posterior a los resultados.
- Ruta del dataset portátil en el runner. El usuario la indica con `--data`.
- Tabla, gráfico y explicación de la presentación actualizados. El mensaje del grupo se entrega por separado.
- Datos y predicciones individuales excluidos del repositorio.

La variante FF_ZERO conserva su implementación y sus resultados. La adaptación se comprobó con pruebas unitarias; no se volvió a ejecutar el entrenamiento completo de 30 semillas del control de mediana.

Las rutas absolutas personales se sustituyeron por [ruta_local] en las copias públicas del protocolo e identidad originales. Los hashes registrados describen los originales guardados localmente, no esas copias con rutas omitidas.

## Actualización del 18 de noviembre de 2026

A pedido de la autora, se publica una [release para comparar ensambles](https://github.com/FlorRodriguez1309/experimento-imputacion-ff-cero/releases/tag/datos-ff-cero-2026-11-18) con las 30 predicciones individuales de FF_ZERO, el test preparado original y el promedio del ensamble. Esta actualización amplía la distribución inicial, que había excluido datos y predicciones.

Se verificaron la integridad de los archivos, las 135.633 filas del test y las métricas de cada semilla. El ensamble reproduce 377 BAJA+2, ganancia de $295.817.500 y AUC de 0,938076981444181. No hay nuevos entrenamientos ni cambios en los resultados. Los binarios se adjuntan a la release; no se agregan al historial de Git. No se incluyen predicciones del control histórico de mediana ni las de Mica.
