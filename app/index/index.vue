<template>
  <div class="lottery">
    <h1>韩国1.5分彩数据统计详情</h1>
    <div>
      <h4>
        统计结果
      </h4>
      <div class="lottery-right line-bottom">
        <button @click="tokyoAnalyze">查询</button>
        <input class="input-info" type="number" v-model.trim.number="nextEnd" placeholder="输入截止期数">
        <span>间隔期数：</span>
        <input class="input-info" type="number" v-model.trim.number="preStart" placeholder="输入开始查询期数">
        <span>开始：</span>
      </div>
    </div>
    <div class="lottery-box">
      <div class="lottery-static">
        <span>统计次数：{{result.num}}</span>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>没牛：</span>
          <span>次数：{{result.hollow}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.hollow / result.num)}}</span>
          <span>最大连出次数: {{result.hollowlong}}</span>
          <span>最大连不出次数: {{result.nohollowlong}}</span>
        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛牛：</span>
          <span>次数：{{result.zero}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.zero / result.num)}}</span>
          <span>最大连出次数: {{result.zerolong}}</span>
          <span>最大连不出次数: {{result.nozerolong}}</span>
        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛大：</span>
          <span>次数：{{result.big}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.big / result.num)}}</span>
          <span>最大连出次数: {{result.biglong}}</span>
          <span>最大连不出次数: {{result.nobiglong}}</span>
        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛小：</span>
          <span>次数：{{result.small}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.small / result.num)}}</span>
          <span>最大连出次数: {{result.smalllong}}</span>
          <span>最大连不出次数: {{result.nosmalllong}}</span>
        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛一：</span>
          <span>次数：{{result.one}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.one / result.num)}}</span>
          <span>最大连出次数: {{result.onelong}}</span>
          <span>最大连不出次数: {{result.noonelong}}</span>

        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛二：</span>
          <span>次数：{{result.two}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.two / result.num)}}</span>
          <span>最大连出次数: {{result.twolong}}</span>
          <span>最大连不出次数: {{result.notwolong}}</span>

        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛三：</span>
          <span>次数：{{result.three}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.three / result.num)}}</span>
          <span>最大连出次数: {{result.threelong}}</span>
          <span>最大连不出次数: {{result.nothreelong}}</span>

        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛四：</span>
          <span>次数：{{result.four}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.four / result.num)}}</span>
          <span>最大连出次数: {{result.fourlong}}</span>
          <span>最大连不出次数: {{result.nofourlong}}</span>

        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛五：</span>
          <span>次数：{{result.five}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.five / result.num)}}</span>
          <span>最大连出次数: {{result.fivelong}}</span>
          <span>最大连不出次数: {{result.nofivelong}}</span>

        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛六：</span>
          <span>次数：{{result.six}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.six / result.num)}}</span>
          <span>最大连出次数: {{result.sixlong}}</span>
          <span>最大连不出次数: {{result.nosixlong}}</span>

        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛七：</span>
          <span>次数：{{result.seven}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.seven / result.num)}}</span>
          <span>最大连出次数: {{result.sevenlong}}</span>
          <span>最大连不出次数: {{result.nosevenlong}}</span>

        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛八：</span>
          <span>次数：{{result.eight}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.eight / result.num)}}</span>
          <span>最大连出次数: {{result.eightlong}}</span>
          <span>最大连不出次数: {{result.noeightlong}}</span>

        </div>
      </div>
      <div class="lottery-static">
        <div class="static-head">
          <span>牛九：</span>
          <span>次数：{{result.nine}}；</span>
        </div>
        <div>
          <span>出现概率:{{toFix(result.nine / result.num)}}</span>
          <span>最大连出次数: {{result.ninelong}}</span>
          <span>最大连不出次数: {{result.noninelong}}</span>
        </div>
      </div>
    </div>
    <div class="lottery-content">
      <h4>各期内容</h4>
      <div class="lottery-right button-area">
        <button class="btn" @click="nextPage">
          下一页
        </button>
        <button class="btn" @click="prePage">
          上一页
        </button>
        <button class="btn" @click="firstPage">
          首页
        </button>
      </div>
      <table class="lottery-table">
        <tr>
          <th class="table-periods">期数</th>
          <th class="table-content">内容</th>
          <th class="table-result">结果</th>
        </tr>
        <tr v-for="(item, index) in results" :key="index">
          <td class="table-periods">{{item.periods}}</td>
          <td class="table-content">{{item.content}}</td>
          <td class="table-result">{{item.result.join(',')}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { staticResult, staticList } from '../api-v1/example';

export default {
  data: () => ({
    preStart: 0,
    nextEnd: 0,
    result: {},
    results: [],
    start: 0,
    limit: 100,
    page: 0
  }),
  methods: {
    async tokyoAnalyze() {
      if (this.preStart < 0 || this.nextEnd < 0) {
        alert('输入有误请重新输入!');
        return;
      }
      const filter = {};
      if (this.preStart) {
        filter.start = this.preStart - 1;
      }
      if (this.nextEnd) {
        filter.limit = this.nextEnd;
      }
      this.result = await staticResult.get(filter);
    },
    async staticQuery() {
      this.result = await staticResult.get();
      this.results = (await staticList.get({
        start: 0,
        limit: 100
      })).results;
    },
    async queryList() {
      this.results = (await staticList.get({
        start: this.start || 0,
        limit: this.limit || 0
      })).results;
    },
    async firstPage() {
      this.page = 0;
      this.start = this.page * this.limit;
      await this.queryList();
    },
    async nextPage() {
      this.page += 1;
      this.start = this.page * this.limit;
      await this.queryList();
    },
    async prePage() {
      if (this.page == 0) {
        alert('已经是第一页了不能再上一页了');
        return;
      }
      this.page -= 1;
      this.start = this.page * this.limit;
      await this.queryList();
    },
    toFix(data) {
      return `${(data * 100).toFixed(2)}%`;
    }
  },
  async mounted() {
    this.staticQuery();
  }
};
</script>
<style lang="stylus">
.lottery
  &-right
    display: flex
    flex-direction: row-reverse
    .input-info
      margin-right: 2em
      width: 4em
  .line-bottom
    margin-bottom: 20px
  &-box
    border: 1px solid #e3e3e3
    padding: 5px 5px 20px 5px
  &-static
    border-bottom: 1px solid #e5e5e5
    padding: 10px
    .static-head
      margin-bottom: 5px
  &-content
    padding: 10px
  .button-area
    margin-bottom: 10px
    .btn
      margin-right: 15px
  &-table
    width: 100%
    .table-periods
    .table-content
      width: 25%
      text-align: center
    .table-result
      width: 50%
      text-align: center
</style>
