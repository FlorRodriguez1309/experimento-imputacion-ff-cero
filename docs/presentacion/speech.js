'use strict';
// Guiones para acompañar la exposición. Las fuentes permanecen en su propio panel.
const speeches = {
  portada: [
    'Somos Agustín, Micaela y Florencia. En este trabajo quisimos responder una pregunta: cuando faltan datos, ¿conviene completarlos o dejar que el modelo trabaje con esos faltantes?',
    'Comparamos distintas alternativas en LightGBM. Nos interesó tanto la calidad de las predicciones como la ganancia de una campaña. Vamos a mostrar qué probamos, qué resultados encontramos y hasta dónde podemos interpretarlos.'
  ],
  hipotesis: [
    'Nuestra referencia es el modelo sin imputación: dejamos los datos faltantes tal como están y LightGBM los trata de manera nativa. Queremos saber si completarlos mejora la ganancia.',
    'La hipótesis es que la ausencia de un dato puede contener información. Si lo rellenamos, podríamos perder parte de esa señal. Por eso también probamos indicadores: una variable que marca con uno si el dato faltaba y con cero si estaba presente. Que ayuden es algo que tenemos que comprobar.'
  ],
  tiempo: [
    'Para comparar respetamos el orden del tiempo. Primero elegimos la configuración usando el modelo sin imputación, que llamamos E0. Probamos 50 configuraciones con Optuna, entrenando de marzo a junio y evaluando en agosto.',
    'Después fijamos esa configuración y la cantidad de contactos para cada experimento. Entrenamos los modelos finales de marzo a agosto y los evaluamos en octubre. Los meses anteriores aportan historia para construir las variables temporales. Octubre queda como el mismo test para todos los métodos de cada experimento.'
  ],
  familias: [
    'Organizamos el trabajo en dos experimentos. El experimento 1, o EXP1, usa las variables originales y sus valores y cambios de meses anteriores. El experimento 2, o EXP2, agrega indicadores de ausencia y su historia temporal.',
    'Cada experimento eligió su configuración por separado usando su E0. Por eso uno tiene 280 árboles y el otro 361, y también cambia la cantidad de contactos. Dentro de cada experimento esos valores quedan fijos. Esto permite comparar las imputaciones, pero al comparar EXP1 con EXP2 no podemos atribuir toda la diferencia a los indicadores.'
  ],
  metodos: [
    'Probamos ocho métodos base. E0 deja los faltantes. Media, mediana y moda los completan con un valor calculado en los datos de entrenamiento. Forward fill usa el último valor conocido del mismo cliente.',
    'También probamos dos métodos que usan otras variables para estimar lo que falta: Ridge iterativo y miceforest. Finalmente, probamos completar directamente con cero. La idea es comparar alternativas sencillas y más elaboradas bajo la misma configuración de cada experimento.'
  ],
  'forward-fill': [
    'Este es un ejemplo inventado para mostrar cómo funciona, con una variable de un cliente a lo largo de varios meses. En la vista original hay valores conocidos y espacios vacíos.',
    'Si seleccionamos Forward fill, cada espacio toma el último valor conocido de ese cliente. El primer faltante sigue vacío porque todavía no hay historia. Al seleccionar FF más cero, completamos ese faltante residual con cero. Por eso FF más cero es distinto de poner cero directamente en todos los faltantes.'
  ],
  metricas: [
    'Acá medimos dos cosas. El AUC evalúa qué tan bien el modelo coloca a quienes se dan de baja por encima de quienes permanecen, considerando el ranking completo. Para esa métrica agrupamos BAJA más uno y BAJA más dos.',
    'La ganancia mira la campaña: contactamos solo a los primeros N clientes del ranking. En la fórmula del experimento, BAJA más dos genera recompensa y los otros contactos tienen costo.',
    'Entonces, ordenar mejor clientes que quedan fuera de ese grupo puede mejorar el AUC sin cambiar la ganancia. Por eso miramos ambas métricas.'
  ],
  inferencia: [
    'No nos quedamos con una sola corrida. Entrenamos cada método 30 veces, cambiando la semilla, que es el número que controla la aleatoriedad del entrenamiento.',
    'Pareadas significa que usamos la misma lista de semillas para todos los métodos. Comparamos la corrida de un método con la corrida del otro que usó la misma semilla. Así obtenemos 30 diferencias emparejadas.',
    'Usamos Wilcoxon para contrastar esas diferencias y Holm para ajustar por las múltiples comparaciones. Las 30 corridas usan los mismos clientes de octubre: no son 30 meses distintos ni 30 muestras independientes de clientes.'
  ],
  ganancia: [
    'Este gráfico compara cada imputación con el modelo sin imputación. El cero marca la referencia. Un valor a la derecha significa mayor ganancia media en las 30 corridas y uno a la izquierda significa menor ganancia.',
    'La columna de la derecha muestra el p ajustado por Holm. Lo usamos para interpretar la evidencia de las comparaciones pareadas. Un resultado no significativo no demuestra que los métodos sean iguales.'
  ],
  ensambles: [
    'Ahora mostramos otra evaluación: el ensamble. Para cada cliente promediamos las predicciones de los 30 modelos y armamos un único ranking. Calculamos el AUC y la ganancia de ese ranking.',
    'Por eso la ganancia del ensamble puede ser distinta del promedio de las ganancias individuales. Con los controles podemos cambiar de experimento y de métrica. Las diferencias del gráfico son descriptivas: los tests por semilla que mostramos antes no prueban diferencias entre estos ensambles.'
  ],
  variantes: [
    'Acá nos concentramos en las cinco extensiones de forward fill y las comparamos contra forward fill solo, dentro de EXP1. Probamos sumar indicadores, completar con una mediana o con cero, y limitar el arrastre a dos filas.',
    'El gráfico muestra la diferencia de ganancia media por semilla. Algunas variantes quedan por encima de la referencia, pero ninguna demuestra una mejora de ganancia después del ajuste de Holm. Eso no significa que sean idénticas: significa que esta comparación no aporta evidencia suficiente para afirmar una mejora.'
  ],
  'ff-cero': [
    'En FF más cero primero conservamos la última información conocida del cliente y después completamos con cero lo que todavía falta.',
    'Su ensamble alcanza unos 295,82 millones de pesos y captura 377 casos BAJA más dos entre los 4.323 contactos. La ganancia media de las corridas individuales es de 291,42 millones.',
    'En las comparaciones por semilla encontramos mejora de AUC frente a forward fill solo, pero no una mejora concluyente de ganancia. Ese es el alcance del resultado: el AUC mejora, pero no podemos afirmar una ventaja económica con estos tests.'
  ],
  medianas: [
    'Encontramos que calcular la mediana antes o después del forward fill produce dos tratamientos distintos. Este ejemplo muestra por qué: si los valores observados son cero y cien, la mediana es cincuenta.',
    'Si después del arrastre tenemos tres ceros y un cien, la mediana pasa a cero. Ambas opciones usan datos de entrenamiento, pero una resume los valores observados y la otra el panel después del relleno. Conservamos las dos variantes y usamos la mediana posterior como control compartido de FF más cero.'
  ],
  limite: [
    'El límite de dos en el código significa dos filas faltantes consecutivas. Si los registros fueran de meses consecutivos, podría parecer un límite de dos meses, pero hay clientes con huecos en su historia.',
    'En este ejemplo ilustrativo, entre enero, mayo y octubre hay solo dos filas posteriores. El algoritmo puede rellenarlas aunque hayan pasado varios meses. Lo verificamos en el panel real: hay 53 saltos entre registros de más de un mes. Por eso lo llamamos límite de dos filas. Un límite de dos meses exigiría otra implementación y una nueva evaluación.'
  ],
  semillas: [
    'Cada punto muestra la ganancia de una de las 30 corridas. El punto destacado marca el promedio. Así podemos ver que un mismo método no da exactamente el mismo resultado cuando cambia la aleatoriedad del modelo.',
    'Esta variación es la razón por la que repetimos y emparejamos las corridas. Aun así, todos estos puntos corresponden a los mismos clientes y al mismo mes. Nos muestran variabilidad del entrenamiento, pero no qué pasaría al aplicar el modelo en otro período.'
  ],
  discusion: [
    'Al mirar los ensambles, el método con mayor AUC no siempre es el que da mayor ganancia. En EXP1, la mayor AUC corresponde a forward fill con mediana posterior. La mayor ganancia la comparten Ridge y FF más cero, con unos 295,82 millones.',
    'En EXP2, ceros directos tiene la mayor AUC y Ridge la mayor ganancia, de unos 297,22 millones. Esto retoma la distinción anterior: el ranking completo y los primeros clientes de la campaña evalúan aspectos diferentes. Son máximos observados, no pruebas de superioridad o equivalencia entre ensambles.'
  ],
  limites: [
    'Los resultados tienen límites. Evaluamos un solo mes y elegimos los parámetros sobre E0, de modo que esa configuración podría favorecer al control. Además, reutilizar el test para mirar nuevas variantes puede influir en las decisiones posteriores.',
    'También queda pendiente contrastar los ensambles de las variantes FF con predicciones alineadas por cliente. El histórico de marzo a junio se conserva aparte porque cambia el entrenamiento y no tenemos la identidad completa de esa corrida. Por eso no mezclamos todos los resultados como si fueran una única comparación.'
  ],
  conclusiones: [
    'La conclusión es que imputar puede ayudar, pero el resultado depende del método y de la configuración. En EXP2, Ridge muestra una mejora de ganancia frente al modelo sin imputación: la diferencia media es de unos 5,17 millones, con evidencia en el contraste pareado. Las extensiones de forward fill no muestran una mejora concluyente de ganancia frente a forward fill solo.',
    'El próximo paso es repetir en otra ventana temporal. Para aislar el aporte de los indicadores, necesitamos comparar con y sin ellos manteniendo los mismos parámetros, árboles y número de contactos. Esa comparación todavía no está hecha.'
  ],
  fuentes: [
    'Acá dejamos los enlaces al código, al consolidado de resultados y a las fuentes que usamos. El dashboard permite consultar las tablas completas y las comparaciones estadísticas. En el repositorio de FF más cero también están los archivos preparados para comparar ensambles.',
    'Todo lo que mostramos corresponde a las corridas verificadas. La pregunta que queda abierta es si los resultados se mantienen al repetir el experimento en otro mes.'
  ]
};
