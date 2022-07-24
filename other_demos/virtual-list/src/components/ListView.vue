<template>
  <div class="list-view" @scroll="handleScroll">
    <!-- 一个高度为总列表高度的盒子，为了把滚动条撑起来 -->
    <div class="list-view-phantom" :style="{ height: contentHeight }"></div>
    <!-- 列表展示区域，即可见区域 -->
    <div ref="content" class="list-view-content" :style="{ top: offset }">
      <div
        class="list-view-item"
        :style="{ height: itemHeight + 'px' }"
        v-for="(item, index) in visibleData"
        :key="index"
      >
        {{ item.value }}˝
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListView",
  props: {
    // 长列表数据
    data: {
      type: Array,
      require: true,
    },
    // 单个列表项的高度，默认30px
    itemHeight: {
      type: Number,
      default: 30,
    },
  },
  computed: {
    // 可渲染区域高度，其实就是所有数据组成的列表的总高度
    contentHeight() {
      return this.data.length * this.itemHeight + "px";
    },
    // 位移量
    offset() {
      return this.start * this.itemHeight + "px";
    },
  },
  mounted() {
    this.updateVisibleData();
  },
  data() {
    return {
      // 要展示的数据列表
      visibleData: [],
      start: 0,
    };
  },
  methods: {
    // 计算虚拟列表数据
    updateVisibleData(scrollTop) {
      scrollTop = scrollTop || 0;
      // 向上取整数，最终显示的数据条数
      const visibleCount = Math.ceil(this.$el.clientHeight / this.itemHeight);
      // 起始数据index
      const start = Math.floor(scrollTop / this.itemHeight);
      this.start = start;
      // 结束数据index
      const end = start + visibleCount;
      // 更新可视区域要展示的数据列表
      this.visibleData = this.data.slice(start, end);
    },
    // 滚动条监听，进行数据更新
    handleScroll() {
      const scrollTop = this.$el.scrollTop;
      this.updateVisibleData(scrollTop);
    },
  },
};
</script>

<style>
/* 虚拟列表最外层的包裹盒子 */
.list-view {
  height: 100px;
  overflow-y: auto;
  border: 1px solid #aaa;
  position: relative;
}

.list-view-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

/* 列表展示盒子 */
.list-view-content {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
}

/* 列表单条数据项 */
.list-view-item {
  color: #666;
  line-height: 30px;
  padding: 5px;
  box-sizing: border-box;
}
</style>
