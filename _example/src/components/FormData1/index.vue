<template>
  <div class="form-section">
    <a-row>
      <a-col :span="4">类型：</a-col>
      <a-col :span="20">
        <a-radio-group v-model:value="infoData.radioType">
          <a-radio :value="1">纸质</a-radio>
          <a-radio :value="2">电子</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row :class="{error: errorTextMap.name}">
      <a-col :span="4">名称：</a-col>
      <a-col :span="20">
        <a-input placeholder="输入" v-model:value="infoData.name" @change="onChange('name', $event)" />
        <div class="error-text">{{errorTextMap.name}}</div>
      </a-col>
    </a-row>
    <a-row :class="{error: errorTextMap.phone}">
      <a-col :span="4">手机号：</a-col>
      <a-col :span="20">
        <a-input placeholder="输入" v-model:value="infoData.phone" @change="onChange('phone', $event)" />
        <div class="error-text">{{errorTextMap.phone}}</div>
      </a-col>
    </a-row>
    <a-row :class="{error: errorTextMap.email}" v-if="infoData.radioType === RadioType.ELEC">
      <a-col :span="4">邮箱：</a-col>
      <a-col :span="20">
        <a-input placeholder="输入" v-model:value="infoData.email" @change="onChange('email', $event)" />
        <div class="error-text">{{errorTextMap.email}}</div>
      </a-col>
    </a-row>
    <a-row :class="{error: errorTextMap.address}" v-if="infoData.radioType === RadioType.ADDR">
      <a-col :span="4">地址：</a-col>
      <a-col :span="20">
        <a-row>
          <a-col :lg="8" :sm="8" :xs="24">
            <a-input placeholder="省份" v-model:value="infoData.address.province" @change="onAddressChange('province', $event)" />
          </a-col>
          <a-col :lg="8" :sm="8" :xs="24">
            <a-input placeholder="城市" v-model:value="infoData.address.city" @change="onAddressChange('city', $event)" />
          </a-col>
          <a-col :lg="8" :sm="8" :xs="24">
            <a-input placeholder="区县" v-model:value="infoData.address.area" @change="onAddressChange('area', $event)" />
          </a-col>
          <a-col :span="24">
            <a-input placeholder="详细地址" v-model:value="infoData.address.detail" @change="onAddressChange('detail', $event)" />
            <div class="error-text">{{errorTextMap.address}}</div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-button type="primary" @click="onSubmit()">提交</a-button>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Row, Col, Radio, RadioGroup, Input, Button } from 'ant-design-vue';
import { useFormData } from './useFormData';

export default defineComponent({
  name: 'FormData1',
  components: {
    ARow: Row,
    ACol: Col,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
    AInput: Input,
    AButton: Button,
  },
  setup() {
    const formData = useFormData();

    return {
      ...formData,
    }
  },
})
</script>

<style lang="less" scoped>
.form-section {
  width: 100%;
  max-width: 600px;
  position: relative;
  margin: 0 auto;
  padding: 16px;

  .ant-row {
    position: relative;
    margin-bottom: 18px;
    &.error {
      .ant-input {
        border-color: #ff4d4f;
        &:focus {
          box-shadow: 0 0 0 2px #ff4d4f33;
        }
      }
    }
  }

  .ant-col {
    position: relative;
    text-align: left;
    margin-bottom: 4px;
  }

  .error-text {
    position: absolute;
    left: 0;
    bottom: 0;
    margin-bottom: -18px;
    color: red;
    font-size: 12px;
  }
}
</style>
