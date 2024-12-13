import Konva from "konva";
import { COMPONENT_SHAPE_TYPE } from "./constant"

export class KonvaJS {
  constructor(selector) {
    this.selector = selector
    this.SCALE_BY = 1.1
    this.stage = null
    this.layer = this.newLayer()
    this.tr = this.newTransformer()
    this.group = this.newGroup({ x: 0, y: 0 })
    this.init()
  }
  init() {
    const el = document.querySelector(this.selector)
    if (!el) {
      return
    }
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    }, false)
    const { clientWidth, clientHeight } = el
    // 创建舞台
    this.stage = this.newStage({
      container: el,
      width: clientWidth,
      height: clientHeight,
      draggable: false,
      type: COMPONENT_SHAPE_TYPE.CANVAS
    })
    this.layer.add(this.group)
    this.layer.add(this.tr)
    this.stage.add(this.layer)
    this.drawBoard()
    this.addListenerStageEvents()

  }
  // 监听鼠标滚轮事件
  addListenerStageEvents() {
    const { stage } = this
    if (!stage) {
      return
    }
    stage.on("wheel", (e) => {
      if (!stage) {
        return
      }
      const oldScale = stage.scaleX()
      const pointer = stage.getPointerPosition()
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale
      }
      let direction = e.evt.deltaY > 0 ? -1 : 1
      if (e.evt.ctrlKey) {
        direction = -direction
      }
      const newScale = direction > 0 ? oldScale * this.SCALE_BY : oldScale / this.SCALE_BY
      stage.scale({ x: newScale, y: newScale })
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale
      }
      stage.position(newPos)
    })
  }
  // 创建画板
  drawBoard() {
    if (!this.stage) {
      return
    }
    const { width, height } = this.stage.getAttrs()
    const x = width / 2 - (width * 0.6) / 2
    const y = height / 2 - (height * 0.6) / 2
    const board = this.newRect({
      id: this.getUUID(),
      title: "画板",
      name: "board",
      x: x,
      y: y,
      width: width * 0.6,
      height: height * 0.6,
      fill: "#ffffff",
      type: COMPONENT_SHAPE_TYPE.BOARD,
      stroke: "#ffffff",
      strokeWidth: 1,
      opacity: 1,
      create: true,
      scaleX: 1,
      scaleY: 1,
    })
    this.group.add(board)
  }
  drawShapes(type, position, options) {
    if (!this.stage) {
      return
    }
    let shapes
    const id = this.getUUID()
    // 拖动时边界处理
    const boardAttr = this.stage.findOne('.board').getAttrs()
    const dragBoundFunc = (pos) => {
      const { width, height, scaleX = 1, scaleY = 1 } = shapes.getAttrs()
      const shapeWidth = width * scaleX
      const shapeHeight = height * scaleY
      const boardX = boardAttr.x
      const boardY = boardAttr.y
      const boardWidth = boardAttr.width
      const boardHeight = boardAttr.height
      const stageX = (this.stage.getAttrs().x || 0)
      const stageY = (this.stage.getAttrs().y || 0)

      // 加上stage移动的位置
      // 边界处理 x 不小于画板x 不大于(画板宽度-元素宽度+画板x)
      // 缩放时需要计算缩放比例的边界
      const minX = stageX + boardX * (this.stage.getAttrs().scaleX || 1)
      const minY = stageY + boardY * (this.stage.getAttrs().scaleY || 1)
      const maxX = stageX + (boardX + boardWidth - shapeWidth) * (this.stage.getAttrs().scaleY || 1)
      const maxY = stageY + (boardY + boardHeight - shapeHeight) * (this.stage.getAttrs().scaleY || 1)

      // 不大于部分
      let newX = Math.min(maxX, pos.x)
      let newY = Math.min(maxY, pos.y)
      // 不小于部分
      newX = Math.max(minX, newX)
      newY = Math.max(minY, newY)

      return { x: newX, y: newY }
    }
    if (type === COMPONENT_SHAPE_TYPE.TEXT) {
      if (!options) {
        const allShapes = this.stage.find('.text')
        options = {
          id: id,
          title: `文本${allShapes.length + 1}`,
          name: "text",
          text: "文本",
          fontSize: 20,
          width: 200,
          height: 100,
          fill: "#000000",
          draggable: true,
          type: type,
          opacity: 1,
          create: true,
          scaleX: 1,
          scaleY: 1,
        }
      }
      // 添加拖动边界处理
      // options.dragBoundFunc = dragBoundFunc
      shapes = this.newText(options)
    }else if (type === COMPONENT_SHAPE_TYPE.RECT) {
      if (!options) {
        const allShapes = this.stage.find('.rect')
        options = {
          id: id,
          title: `矩形${allShapes.length + 1}`,
          name: "rect",
          width: 200,
          height: 100,
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 1,
          draggable: true,
          type: type,
          opacity: 1,
          create: true,
          scaleX: 1,
          scaleY: 1,
        }
      }
      shapes = this.newRect(options)
    } else if (type === COMPONENT_SHAPE_TYPE.PARALLELOGRAM) {
      if (!options) {
        const allShapes = this.stage.find('.parallelogram')
        options = {
          id: id,
          title: `平行四边形${allShapes.length + 1}`,
          name: "parallelogram",
          width: 200,
          height: 100,
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 1,
          draggable: true,
          skewX: -0.5,
          type: type,
          opacity: 1,
          create: true,
          scaleX: 1,
          scaleY: 1,
        }
      }
      shapes = this.newRect(options)
    } else if (type === COMPONENT_SHAPE_TYPE.RHOMBUS) {
      if (!options) {
        const allShapes = this.stage.find('.rhombus')
        options = {
          id: id,
          title: `菱形${allShapes.length + 1}`,
          sides: 4,
          radius: 100,
          name: "rhombus",
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 1,
          draggable: true,
          type: type,
          opacity: 1,
          create: true,
          scaleX: 1,
          scaleY: 1,
        }
      }
      shapes = this.newRegularPolygon(options);
    } else if (type === COMPONENT_SHAPE_TYPE.IMAGE) {
      if (!options) {
        const allShapes = this.stage.find('.image')
        options = {
          id: id,
          title: `图片${allShapes.length + 1}`,
          name: "image",
          width: 200,
          height: 100,
          image: null,
          draggable: true,
          type: type,
          opacity: 1,
          create: true,
          scaleX: 1,
          scaleY: 1,
        }
      }
      shapes = this.newImage(options)
    }
    if (!shapes) {
      return
    }
    // 拖入元素的边界
    const pos = dragBoundFunc(position)
    shapes.position(pos)
    this.group.add(shapes)
    return shapes
  }
  // 监听窗口大小变化
  onresize() {
    const el = document.getElementById(this.id)
    if (!el) {
      return
    }
    const { clientWidth, clientHeight } = el
    this.stage.setAttrs({
      width: clientWidth,
      height: clientHeight
    })
  }
  // 获取唯一id
  getUUID() {
    let d = Date.now()
    // 浏览器支持性能API 则使用
    if (typeof performance !== "undefined" && typeof performance.now === 'function') {
      d += performance.now()
    }
    return 'xxxxxxyxxyxxxxx4xxxyxxxxyyxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16)
    })
  }
  // 创建舞台
  newStage(data) {
    return new Konva.Stage(data)
  }
  // 创建图层
  newLayer() {
    return new Konva.Layer()
  }
  // 创建变形器
  newTransformer(options = {}) {
    return new Konva.Transformer(options)
  }
  // 创建组
  newGroup(data) {
    return new Konva.Group(data)
  }
  // 创建矩形
  newRect(data) {
    return new Konva.Rect(data)
  }
  // 创建圆形
  newCircle(data) {
    return new Konva.Circle(data)
  }
  // 创建文本
  newText(data) {
    const textNode = new Konva.Text(data)
    // 监听文本变形事件
    textNode.on('transform', function () { 
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        height: textNode.height() * textNode.scaleY(),
        scaleX: 1,
        scaleY: 1
      });
    })
    // 监听文本双击事件
    textNode.on('dblclick dbltap', () => {
      const tr = this.tr;
      const stage = this.stage;
      textNode.hide();
      tr.hide();
      const textPosition = textNode.absolutePosition();
      const areaPosition = {
        x: stage.container().offsetLeft + textPosition.x,
        y: stage.container().offsetTop + textPosition.y,
      };
      //编辑文本样式
      const textarea = document.createElement('textarea');
      // textareaDom = textarea
      document.body.appendChild(textarea);
      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
      textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = textNode.lineHeight().toString();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = 'left top';
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      const rotation = textNode.rotation();
      let transform = '';
      if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
      }
      textarea.style.transform = transform;
      textarea.style.height = 'auto'; 
      textarea.style.height = textarea.scrollHeight + 3 + 'px';
      textarea.focus();
      //移除编辑输入框
      function removeTextarea() {
        if (textarea.parentNode){
          textarea.parentNode.removeChild(textarea);
        }
       
        textNode.show();
        tr.show();
        tr.forceUpdate(); 
      } 
      function setTextareaWidth(newWidth) {
        textarea.style.width = newWidth + 'px';
      }
      // keydown事件
      textarea.addEventListener('keydown', function (evt) { 
        if (evt.key === "Enter") {
          textNode.text(textarea.value);
          removeTextarea();
        } 
        if (evt.key === "Escape") {
          removeTextarea();
        }
      });
      // 设置文本框高度
      textarea.addEventListener('keydown', function () {
        let scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px';
      }); 
    })
    return textNode
  }
  // 创建正多边形
  newRegularPolygon(data) {
    return new Konva.RegularPolygon(data)
  }
  // 创建直线
  newLine(data) {
    return new Konva.Line(data)
  }
  newLabel(data) {
    return new Konva.Label(data)
  }
  newTag(data) {
    return new Konva.Tag(data)
  }
  // 创建箭头
  newArrows(data) {
    return new Konva.Arrow(data)
  }
  // 创建路径
  newPath(data) {
    return new Konva.Path(data)
  }
  newImage(data) {
    return new Konva.Image(data)
  }
}
