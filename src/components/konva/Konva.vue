<template>
  <div>
    <div class="wrap">
      <div class="left-wrap">
        <el-tabs v-model="leftActive">
          <el-tab-pane label="元素库" name="first">
            <el-row>
              <el-col :span="8">
                <div class="left-element-item" draggable="true" @mousedown="onElementClick('text')">
                  <i class="el-icon-setting" />
                  文字
                </div>
              </el-col>
              <el-col :span="8">
                <div class="left-element-item" draggable="true" @mousedown="onElementClick('rect')">
                  <i class="el-icon-setting" />
                  矩形
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="画布元素" name="second">
            <div v-for="item in layerShapes" :key="item.id">
              {{ item.title }}
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="middle-wrap">
        <div id="canvas" class="canvas-box" />
      </div>
      <div class="right-wrap">
        <el-tabs v-model="rightActive">
          <el-tab-pane label="基础设置" name="first">
            <div class="right-setting-box">
              <!-- 名称 -->
              <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="20">
                  <el-input
                    v-model="currentShape.title"
                    size="mini"
                  />
                </el-col>
                <el-col :span="4">
                  <i class="el-icon-view" />
                </el-col>
              </el-row>
            </div>
            <div class="right-setting-box">
              <div class="right-setting-title">布局</div>
              <el-row>
                <el-col :span="12">
                  <!-- x坐标 -->
                  <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="4">
                      <div class="text-align-right">X</div>
                    </el-col>
                    <el-col :span="20">
                      <el-input
                        v-model="currentShape.x"
                        size="mini"
                        @change="onChangeAttrs"
                      />
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <!-- y坐标 -->
                  <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="4">
                      <div class="text-align-right">Y</div>
                    </el-col>
                    <el-col :span="20">
                      <el-input
                        v-model="currentShape.y"
                        size="mini"
                        @change="onChangeAttrs"
                      />
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <!-- 宽 -->
                  <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="4">
                      <div class="text-align-right">W</div>
                    </el-col>
                    <el-col :span="20">
                      <el-input
                        v-model="currentShape.width"
                        size="mini"
                        @change="onChangeAttrs"
                      />
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <!-- 高 -->
                  <el-row :gutter="10" type="flex" align="middle">
                    <el-col :span="4">
                      <div class="text-align-right">H</div>
                    </el-col>
                    <el-col :span="20">
                      <el-input
                        v-model="currentShape.height"
                        size="mini"
                        @change="onChangeAttrs"
                      />
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div v-show="currentShape.type === 'text'" class="right-setting-box">
              <div class="right-setting-title">文本</div>
              <!-- 字体/颜色 -->
              <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="20">
                  <el-select
                    v-model="currentShape.fontFamily"
                    placeholder="请选择"
                    size="mini"
                    @change="onChangeAttrs"
                  >
                    <el-option
                      label="Helvetica"
                      value="Helvetica"
                    />
                    <el-option
                      label="Courier"
                      value="Courier"
                    />
                    <el-option
                      label="Microsoft Yahei"
                      value="Microsoft Yahei"
                    />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-color-picker
                    v-model="currentShape.fill"
                    show-alpha
                    class="width-50"
                    @change="onChangeAttrs"
                  />
                </el-col>
              </el-row>
              <!-- 字号 行距 加粗 -->
              <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="10">
                  <el-select
                    v-model="currentShape.fontSize"
                    placeholder="字号"
                    size="mini"
                    @change="onChangeAttrs"
                  >
                    <el-option
                      label="12px"
                      value="12"
                    />
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-select
                    v-model="currentShape.lineHeight"
                    placeholder="行距"
                    size="mini"
                    @change="onChangeAttrs"
                  >
                    <el-option
                      label="1.25"
                      value="1.25"
                    />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-checkbox-button
                    v-model="currentShape.fontStyle"
                    class="el-checkbox-button--mini"
                    label="B"
                    true-label="bold"
                    false-label="normal"
                    @change="value => {currentShape.fontStyle = value, onChangeAttrs(value)}"
                  />
                </el-col>
              </el-row>
              <!-- 对齐方式 -->
              <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="10">
                  <el-radio-group v-model="currentShape.align" size="mini" @change="onChangeAttrs">
                    <el-radio-button label="left">左</el-radio-button>
                    <el-radio-button label="center">中</el-radio-button>
                    <el-radio-button label="right">右</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col :span="10">
                  <el-radio-group v-model="currentShape.verticalAlign" size="mini" @change="onChangeAttrs">
                    <el-radio-button label="top">上</el-radio-button>
                    <el-radio-button label="middle">中</el-radio-button>
                    <el-radio-button label="bottom">下</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-row>
            </div>
            <!-- 填充 -->
            <div v-show="currentShape.type === 'rect'" class="right-setting-box">
              <div class="right-setting-title">填充</div>
              <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="4">
                  <el-color-picker
                    v-model="currentShape.fill"
                    show-alpha
                    class="width-50"
                    @change="onChangeAttrs"
                  />
                </el-col>
              </el-row>
            </div>
            <!-- 线条 -->
            <div v-show="currentShape.type === 'rect'" class="right-setting-box">
              <div class="right-setting-title">线条</div>
              <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="10">
                  <el-input
                    v-model="currentShape.strokeWidth"
                    size="mini"
                    @change="onChangeAttrs"
                  />
                </el-col>
                <el-col :span="10">
                  <el-select
                    v-model="currentShape.dash"
                    placeholder="线条类型"
                    size="mini"
                    @change="onChangeAttrs"
                  >
                    <el-option
                      label="实线"
                      value="[]"
                    />
                    <el-option
                      label="虚线"
                      value="[2, 2]"
                    />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-color-picker
                    v-model="currentShape.stroke"
                    show-alpha
                    class="width-50"
                    @change="onChangeAttrs"
                  />
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="高级设置" name="second">高级设置</el-tab-pane>
        </el-tabs>
      </div>
      <div v-show="contextMenuVisible" class="context-menu">
        <div
          v-for="(item, index) in contextMenuList"
          :key="index"
          class="context-menu-item"
          :class="item.disabled ? 'disabled' : ''"
          @click="onMenuClick(item.type)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <el-button type="primary" size="mini" @click="onSaveShape">保存</el-button>
    <el-button type="primary" size="mini" @click="onRecoverShape">恢复</el-button>
    <el-button type="primary" size="mini" @click="onInitBasePic">添加图片</el-button>
  </div>
</template>

<script>
import { KonvaJS } from './utils/konva'
import { COMPONENT_SHAPE_TYPE } from './utils/constant'
export default {
  name: 'Konva',
  props: {
  },
  data() {
    return {
      // 左侧tab
      leftActive: 'first',
      // 右侧tab
      rightActive: 'first',
      // 拖动元素到画布的类型
      addType: '',
      // 菜单是否可见
      contextMenuVisible: false,
      // 菜单列表
      contextMenuList: [
        { name: '上移图层', type: 'moveUp', disabled: false },
        { name: '下移图层', type: 'moveDown', disabled: false },
        { name: '删除图层', type: 'destroy', disabled: false }
      ],
      // 当前元素的信息
      currentShape: {
        name: 'Undefined Name', // 名称
        x: 0, // x坐标
        y: 0, // y坐标
        width: 100, // 宽
        height: 100, // 高
        fill: '#000', // 填充颜色
        fontStyle: 'normal'
      },
      // konva实例
      KonvaInstance: new KonvaJS('#canvas')
    }
  },
  computed: {
    // 获取图层元素 忽略board元素
    layerShapes() {
      const { group } = this.KonvaInstance
      const shapes = group.getChildren()
      const attrs = shapes.filter(item => !['board', 'image'].includes(item.getAttrs().type)).map(item => item.getAttrs())
      return attrs
    }
  },
  mounted() {
    // 初始化实例
    this.KonvaInstance.init()
    // 监听stage上的事件
    this.listenerStageEvents()
  },
  methods: {
    // 添加图片作为背景
    onInitBasePic() {
      const KonvaInstance = this.KonvaInstance
      const { stage } = KonvaInstance
      const boardAttr = stage.findOne('.board').getAttrs()
      const image = new Image()
      image.src = './favicon.ico'
      image.onload = () => {
        KonvaInstance.drawShapes(COMPONENT_SHAPE_TYPE.IMAGE, {
          x: boardAttr.x,
          y: boardAttr.y
        }, {
          id: 'imageid',
          name: 'image',
          image: image,
          width: boardAttr.width,
          height: boardAttr.height,
          type: COMPONENT_SHAPE_TYPE.IMAGE
        })
      }
    },
    // 保存图表元素位置信息
    onSaveShape() {
      localStorage.setItem('konva-shape', JSON.stringify(this.layerShapes))
    },
    // 恢复图表元素位置信息
    onRecoverShape() {
      const layerShapes = JSON.parse(localStorage.getItem('konva-shape'))
      console.log(layerShapes)
      const KonvaInstance = this.KonvaInstance
      for (let i = 0; i < layerShapes.length; i++) {
        const shape = KonvaInstance.drawShapes(layerShapes[i].type, {
          x: layerShapes[i].x,
          y: layerShapes[i].y
        }, layerShapes[i])
        if (!shape) {
          return
        }
        this.listenerShapeEvents(shape)
      }
    },
    // 监听stage上的事件
    listenerStageEvents() {
      const KonvaInstance = this.KonvaInstance
      const { stage, tr } = KonvaInstance
      if (!stage) {
        return
      }
      const container = stage.container()
      // 获取shape的属性
      const getShapeAttrs = this.getShapeAttrs
      // 隐藏右键菜单
      const closeContextMenu = this.closeContextMenu
      // 显示右键菜单
      const showContextMenu = this.showContextMenu
      // 获取board的属性
      // getShapeAttrs(stage.findOne('.board'))
      // 右键菜单
      stage.on('click tap', (e) => {
        const dom = e.target
        const domAttrs = dom.getAttrs()
        // 鼠标右键
        if (e.evt.button === 2) {
          // 类型不是以下则不显示右键菜单
          if (
            domAttrs.type !== COMPONENT_SHAPE_TYPE.RECT &&
            domAttrs.type !== COMPONENT_SHAPE_TYPE.PARALLELOGRAM &&
            domAttrs.type !== COMPONENT_SHAPE_TYPE.RHOMBUS &&
            domAttrs.type !== COMPONENT_SHAPE_TYPE.TEXT &&
            domAttrs.type !== COMPONENT_SHAPE_TYPE.IMAGE
          ) {
            return
          }
          // 获取shape的属性
          getShapeAttrs(dom)
          closeContextMenu()
          if (!this.contextMenuVisible) {
            showContextMenu()
            let menuDom = document.querySelector('.context-menu')
            if (!menuDom) {
              return
            }
            if (dom.getAbsoluteZIndex() === 5) {
              this.contextMenuList[1].disabled = true
            } else {
              this.contextMenuList[1].disabled = false
            }
            menuDom.style.left = `${e.evt.clientX + 10}px`
            menuDom.style.top = `${e.evt.clientY + 1}px`
          }
        }
      })
      // 鼠标事件
      stage.on('mousedown', (e) => {
        const dom = e.target
        const domAttrs = dom.getAttrs()
        // 中键设置拖拽画板
        if (e.evt.button === 1) {
          stage.draggable(true)
        }
        // 左键把非画布元素加入到变形器中
        if (e.evt.button === 0) {
          closeContextMenu()
          // 点击画板清空变形器
          if (domAttrs.type === COMPONENT_SHAPE_TYPE.CANVAS) {
            // getShapeAttrs(stage.findOne('.board'))
            tr.nodes([])
            return
          }
          // 非create属性不加入
          if (!domAttrs.create) {
            return
          }
          getShapeAttrs(dom)
          if (domAttrs.type === COMPONENT_SHAPE_TYPE.BOARD) {
            tr.nodes([])
            return
          }
          tr.nodes([dom])
        }
      })
      // 拖拽画板
      stage.on('mouseup', (e) => {
        if (e.evt.button === 1) {
          stage.draggable(false)
        }
      })
      // 左侧元素拖拽到画布中
      container.addEventListener('dragover', (e) => {
        e.preventDefault()
      })
      // 拖拽元素到画布中
      container.addEventListener('drop', (e) => {
        e.preventDefault()
        // 添加类型
        const addType = this.addType
        if (addType === '') {
          return
        }
        // 获取pointerposition前需要先设置
        stage.setPointersPositions(e)
        const shape = KonvaInstance.drawShapes(addType, stage.getRelativePointerPosition())
        if (!shape) {
          return
        }
        // 监听shape
        this.listenerShapeEvents(shape)
      })
    },
    // 右键菜单中的方法
    onMenuClick(type) {
      const { stage, tr } = this.KonvaInstance
      // 根据id获取shape
      const shape = stage.findOne(`#${this.currentShape.id}`)
      if (!shape) {
        return
      }
      if (type === 'moveUp') {
        shape.moveUp()
      } else if (type === 'moveDown') {
        if (shape.getAbsoluteZIndex() === 5) {
          return
        }
        shape.moveDown()
      } else if (type === 'destroy') {
        shape.destroy()
      }
      tr.nodes([])
      this.closeContextMenu()
    },
    // 监听shape事件
    listenerShapeEvents(shape) {
      shape.on('dragmove', (e) => {
        this.getShapeAttrs(e.target)
      })
      shape.on('transform', (e) => {
        this.getShapeAttrs(e.target)
      })
    },
    // 获取shape的属性填充到右侧数据中
    getShapeAttrs(shape) {
      const { id, title, opacity, fill, stroke, strokeWidth, width, height, x, y, scaleX, scaleY, type, radius, fontFamily, fontSize, fontStyle, align, verticalAlign, dash } = shape.getAttrs()
      let attrs = {
        id,
        title,
        opacity,
        fill,
        stroke,
        strokeWidth,
        width,
        height,
        x: +x,
        y: +y,
        scaleX,
        scaleY,
        type,
        radius,
        fontFamily,
        fontSize,
        fontStyle,
        align,
        verticalAlign,
        dash: !dash || dash.length <= 0 ? '[]' : JSON.stringify(dash)
      }
      if (type === COMPONENT_SHAPE_TYPE.RHOMBUS) {
        attrs.width = Math.round(radius * scaleX) * 2
        attrs.height = Math.round(radius * scaleY) * 2
      } else {
        attrs.width = Math.round(width * scaleX)
        attrs.height = Math.round(height * scaleY)
      }
      attrs.x = Math.round(x)
      attrs.y = Math.round(y)
      this.currentShape = attrs
    },
    // 当前属性修改后修改shape
    onChangeAttrs() {
      const { stage } = this.KonvaInstance
      const shape = stage.findOne(`#${this.currentShape.id}`)
      if (!shape) {
        return
      }
      const { title, opacity, fill, stroke, strokeWidth, width, height, x, y, type, radius, fontFamily, fontSize, fontStyle, align, verticalAlign, dash = '[]' } = this.currentShape
      shape.setAttrs({
        title,
        opacity,
        fill,
        stroke: stroke,
        strokeWidth: +strokeWidth,
        width: +width,
        height: +height,
        x: +x,
        y: +y,
        scaleX: 1,
        scaleY: 1,
        type,
        radius,
        fontFamily,
        fontSize: +fontSize,
        fontStyle,
        align,
        verticalAlign,
        dash: JSON.parse(dash)
      })
      this.closeContextMenu()
    },
    // 点击左侧元素设置type
    onElementClick(type) {
      this.addType = type
    },
    // 显示右键菜单
    showContextMenu() {
      this.contextMenuVisible = true
    },
    // 隐藏右键菜单
    closeContextMenu() {
      this.contextMenuVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: 1px solid #ccc;

  .left-wrap,
  .right-wrap {
    width: 300px;
    background-color: #fff; /* Optional: for visual separation */
  }
  .left-wrap {
    .left-element-item {
        text-align: center;
        cursor: pointer;
    }
  }
  .right-wrap {
    .right-setting-box {
      padding: 10px;
      border-bottom: 1px solid #ccc;
      .right-setting-title {
        font-size: 14px;
        font-weight: 700;
      }
      .text-align-right {
        text-align: right;
        padding: 10px;
      }
      .el-select {
        width: 100%;
      }
    }

  }

  .middle-wrap {
    flex-grow: 1;
    background-color: #f0f7ff; /* Optional: for visual separation */
    .canvas-box {
        width: 100%;
        height: 100%;
    }
  }

  .context-menu {
    position: fixed;
    background-color: #ccc;
    min-width: 100px;
    font-size: 14px;
    color: #000;
    z-index: 1000;

    .context-menu-item {
        cursor: pointer;
        line-height: 34px;
        text-align: center;

        &:hover {
            background-color: #aaa;
        }
        &.disabled {
            cursor: not-allowed;
        }
    }

  }

  ::v-deep .el-tabs__nav {
    width: 100%;
    .el-tabs__item {
        width: 50%;
        text-align: center;
    }
  }

}

</style>
