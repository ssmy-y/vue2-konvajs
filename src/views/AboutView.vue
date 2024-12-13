<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div id="container"></div>
  </div>
</template>
<script>
import Konva from 'konva';
export default {
  mounted() {
      const el = document.querySelector('#container')
      var stage = new Konva.Stage({
        container: el,
        width: 400,
        height: 400,
      });

      var layer = new Konva.Layer();

      var rect1 = new Konva.Rect({
        x: 20,
        y: 20,
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4,
      });
      // add the shape to the layer
      layer.add(rect1);

      var rect2 = new Konva.Rect({
        x: 150,
        y: 40,
        width: 100,
        height: 50,
        fill: 'red',
        shadowBlur: 10,
        cornerRadius: 10,
      });
      layer.add(rect2);

      var rect3 = new Konva.Rect({
        x: 50,
        y: 120,
        width: 100,
        height: 100,
        fill: 'blue',
        cornerRadius: [0, 10, 20, 30],
      });
      layer.add(rect3);

      // add the layer to the stage
      stage.add(layer);
  }
}
</script>
