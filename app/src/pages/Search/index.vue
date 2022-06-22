<template>
  <div>
    <!-- 商品分类三级列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread:面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!--商品的名字的面包屑的地方  -->
            <li class="with-x" v-if="searchParams.categoryname">
              {{ searchParams.categoryname}}<i @click="removecategoryName">×</i>
            </li>
            <!-- 关键字面包屑的地方 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-show="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTradeMark">×</i>
            </li>
            <!-- 商品属性值面包屑的地方 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props" :key="index">  
               {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
               <!-- 综合|价格排序的地方 -->
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="sort(1)">
                  <a
                    >综合
                    <span
                      v-show="isOne"
                      class="iconfont"
                      :class="{ 'icon-xiafan': isDesc, 'icon-shangfan': isAsc }"
                    ></span
                  ></a>
                </li>
                <li :class="{ active: isTwo }" @click="sort(2)">
                  <a
                    >价格
                    <span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{ 'icon-xiafan': isDesc, 'icon-shangfan': isAsc }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li
                class="yui3-u-1-5"
                v-for="(good, index) in goodsList"
                :key="good.id"
              >
                <div class="list-wrap">
                  <div class="p-img">
                    <!--商品的图片:需要路由跳转的时候,携带商品的ID-->
                    <router-link :to="`/detail/${good.id}`"
                      ><img v-lazy="good.defaultImg"
                    /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a :title="good.title">{{ good.title }}</a>
                  </div>
                  <div class="commit">
                    <i class="command"
                      >已有<span>{{ good.id }}</span
                      >人评价</i
                    >
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
         <Pagination :total="total"
              :pageSize="searchParams.pageSize"
              :pageNo="searchParams.pageNo"
              :pagerCount="5"
              @currentPage="currentPage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters, mapState } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      //将来Search模块搜索的条件
      searchParams: {
        category1Id: "", //一级分类的id
        category2Id: "", //二级分类的id
        category3Id: "", //三级分类的id
        categoryname: "", //商品的名字
        keyword: "", //用户搜索的关键字
        props: [], //商品属性的搜索条件
        trademark: "", //品牌的搜索条件
        order: "1:desc", //排序的参数 【默认初始值:1:desc】
        pageNo: 1, //当前分页器的页码  【默认初始值:1】
        pageSize: 3, //代表当前一页
      },
    };
  },
  components: {
    SearchSelector,
  },
  //钩子函数:beforeCreate、created、beforeMount.执行都是在mounted之前
  //整理参数不能在：beforeCreate因为不能获取VC属性、方法
  beforeMount() {
    //商品分类搜索条件,在发送请求之前，把接口需要传递参数，进行整理（在给服务器发请求之前，把参数整理好，服务器就会返回查询的数据）
    // this.searchParams.category1Id = this.$route.query.category1Id;
    // this.searchParams.categoryName = this.$route.query.categoryName;
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  //组件挂载完毕次钩子执行一次,发请求
  mounted() {
    //在发请求之前:整理用户搜索的参数
    //组件挂载完毕发一次请求
    this.getData();
    //获取用户信息
  },
  computed: {
    //mapGetters,里面的写法，因为getter计算是没有划分模块【home,search】
    ...mapGetters(["goodsList"]),
    ...mapState({
      total: (state) => state.search.searchList.total,
    }),
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
  },
  //把请求的函数进行封装,将来需要多次请求数据,调用多次函数【函数可以复用】
  methods: {
    //发请求,获取搜索模块的数据
    getData() {
      //通知Vuex发请求、仓库存储数据
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    //清除面包屑-商品名字
    removecategoryName() {
      //搜索条件商品名字清空
      this.searchParams.categoryname = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getData();
      //骚操作i:路由自己跳自己
     if(this.$route.params){
        this.$router.push({ name: "search", params: this.$route.params });
     }
    },
    //面包屑移出关键字的回调
    removeKeyword() {
      //清空关键字
      this.searchParams.keyword = undefined;
      //再次发生请求
      this.getData()
      //通知兄弟组件清除关键字
      this.$bus.$emit("clear");
      //进行路由跳转
      if(this.$route.query){
        this.$router.push({ name: "search", query: this.$route.query });
      }
    },
    //子组件给父组件传递数据的自定义事件的回调
    trademarkInfo(trademark){
      //整理品牌相关的搜索条件
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      //再次发请求即可
      this.getData();
    },
    //面包屑清除品牌回调
    removeTradeMark() {
      //清空品牌的搜索条件
      this.searchParams.trademark = undefined;
      //再次发请求获取最新的数据展示
      this.getData();
    },
    //手机品牌属性
    attrInfo(attr,attrValue){
      let newProps = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      //数组去重
     if (this.searchParams.props.indexOf(newProps) == -1) {
        this.searchParams.props.push(newProps);
        //再次发请求，获取最新的数据展示即可
        this.getData();
      }
    },
    //商品属性值面包屑删除回调
    removeAttr(index) {
      //删除对应的数组里面元素
      this.searchParams.props.splice(index, 1);
      //在发一次请求
      this.getData();
    },
    //排序回调
    //参数形式:1:desc
    //1|2,标记flag,到底谁是高亮状态
    //asc|desc排序【sortType】,到底是升序还是降序
    sort(flag) {
      //获取每一次order初始值,与用户点击传递进来的flag进行判断
      let originFlag = this.searchParams.order.split(":")[0];
      let originSortType = this.searchParams.order.split(":")[1];
      //准备一个新的数值，将来赋值给order
      let newOrder = "";
      //高亮的判断
      if (flag == originFlag) {
        newOrder = `${originFlag}:${originSortType == "desc" ? "asc" : "desc"}`;
      } else {
        //不是高亮的按钮
        newOrder = `${flag}:desc`;
      }
      //重新给order赋予新的数值
      this.searchParams.order = newOrder;
      //重新发一次请求
      this.getData();
    },
    currentPage(pageNo) {
      //父组件整理参数
      this.searchParams.pageNo = pageNo;
      this.getData();
    },
  },
  //数据监听：监听组件实例身上的属性的属性值变化
  watch:{
    //监听路由的信息是否发生变化，如果发生变化，再次发生请求。
    $route(newValue,oldValue){
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      //再次发AJAX请求
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>