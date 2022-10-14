<template>
  <div>
    <img :src="item.smallImg" class="auto-img" alt="" />
    <div class="pro-name one-text">{{ item.name }}</div>
    <div class="pro-enname one-text">{{ item.enname }}</div>
    <div class="pro-box">
      <div class="pro-price">￥{{ item.price }}</div>
      <div class="delete">
        <van-icon name="delete" @click.stop="remove()" v-if="isRemove" />
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: "ProductItem",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    isRemove: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    remove() {
      this.$emit("remove");
    },
    goPage() {
      this.$emit("goPage");
    },
  },
};
</script>

<style lang="less" scoped>
.like-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.like-item {
  width: 100px;
  margin: 5px;
  padding-bottom: 15px;
  margin-bottom: 25px;
  &:last-child {
    margin-bottom: 0;
  }
}

.one-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pro-name {
  margin-top: 10px;
  font-size: 14px;
}

.pro-enname {
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 12px;
}

.pro-box {
  flex-basis: 100%;
  display: flex;
  justify-content: space-between;
}

.pro-price {
  font-size: 14px;
  color: #0c34ba;
  font-weight: bold;
}

.delete {
  width: 15px;
  height: 15px;
}
</style>