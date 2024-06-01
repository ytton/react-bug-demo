import { useState } from 'react';
import './App.css';
import { Button, Tabs, Toast } from 'react-vant';
import CustMngSelectPopup from './components/custMngSelectPopup';
import { isArray } from 'lodash-es';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import 'react-json-view-lite/dist/index.css';
function App() {
  const [visible, setVisible] = useState(false);
  const [curTab, setCurTab] = useState('default');
  const [selected, setSelected] = useState({});
  const demoDesc = {
    default: '基础用法',
    disabled: '禁用特定项',
    defaultKeys: '默认选中',
    multiple: '多选',
    simple: '简易选择,无二次确认',
    showPosition: '区分岗位号,多岗位的例子'
  };
  const demoList = {
    default: {},
    disabled: {
      disabledKeys: ['10010', '10011']
    },
    defaultKeys: {
      defaultSelectedKeys: ['10010']
    },
    multiple: {
      multiple: true,
      defaultSelectedKeys: ['10013', '10014'],
      disabledKeys: ['10010', '10011']
    },
    simple: {
      simple: true,
      defaultSelectedKeys: ['10013'],
      disabledKeys: ['10010', '10011']
    },
    showPosition: {
      showPosition: true,
      multiple: true,
      defaultSelectedKeys: ['10013/a1001'],
      disabledKeys: ['10010/a1001', '10011/a1002']
    }
  };
  return (
    <>
      <h3>一个常用的人员选择组件</h3>
      <Tabs type="card" onChange={key => setCurTab(key)} defaultActive="default">
        {Object.keys(demoList).map(item => (
          <Tabs.TabPane key={item} name={item} title={`${item}`}>
            <div className="card">
              <h4>{demoDesc[curTab]}</h4>
              <Button style={{ marginTop: 50 }} onClick={() => setVisible(true)}>
                选择客户经理
              </Button>
              <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <JsonView data={selected} shouldExpandNode={allExpanded} style={defaultStyles} />
              </div>
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>
      <CustMngSelectPopup
        key={curTab}
        {...demoList[curTab]}
        onSubmit={item => {
          if (!item || (isArray(item) && !item.length)) {
            return Toast.fail('请选择客户经理');
          }
          console.log(item);
          setSelected(item);
          setVisible(false);
        }}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
}

export default App;
