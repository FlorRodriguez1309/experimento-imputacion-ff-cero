# Un dato a la vez

Clase web para aprender el experimento desde cero y practicar las slides 1–6. Es independiente de la presentación del grupo.

Publicación: https://florrodriguez1309.github.io/experimento-imputacion-ff-cero/aprender/

Incluye 29 lecciones, seis discursos con preguntas de práctica, un diccionario de 34 términos, explicaciones ampliables y ejercicios de FF, mediana, AUC, ganancia y Holm. Los ejemplos están etiquetados como ilustrativos. El explorador lee los datos reales de `../presentacion/resultados.json` y distingue media por semilla de ensamble.

## Uso y reproducción

Sin dependencias externas ni proceso de compilación. Servir la carpeta `docs` con un servidor HTTP y abrir `/aprender/`. Requiere JavaScript; no se abre directamente como archivo local porque usa módulos y carga datos con fetch. GitHub Pages publica `main:/docs`.

- `index.html` y `style.css`: estructura y diseño responsive.
- `lessons.mjs`: explicaciones, discursos, preguntas y diccionario.
- `app.mjs`: navegación, demostraciones y resultados.
- `math.mjs`: cálculos de las demostraciones.
- `../../analysis/verificar_clase.mjs`: comprobaciones de los cálculos educativos.

Verificar: `node analysis/verificar_clase.mjs`.

QA del 18/11/2026: recorrido de las 29 lecciones en navegador a 1280×800 y 390×844, sin desbordamiento horizontal de página; controles FF, ranking AUC, ganancia, selección de familia, Holm, speech, índice, diccionario y respuestas del repaso comprobados. Las explicaciones detalladas pueden desplazarse verticalmente.

Las cifras proceden del consolidado usado por la presentación. No se agregaron entrenamientos ni contrastes de ensambles. Las limitaciones sobre temporalidad, familias de Holm y comparación entre EXP1/EXP2 se explican en las lecciones.
