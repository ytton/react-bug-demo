import { uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Cell, Checkbox, List, NavBar, Popup, Search } from 'react-vant';

function CustMngSelectPopup({
  mngList,
  multiple = false,
  defaultSelectedKeys = [],
  disabledKeys = [],
  simple = false,
  showPosition = false,
  visible,
  onClose,
  onSubmit
}) {
  const [apiMngList, setApiMngList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [keywords, setKeywords] = useState('');
  const getKey = item => (showPosition ? `${item.id}/${item.positionId}` : item.id);
  const getMngList = () => {
    return new Promise(res => {
      setTimeout(() => {
        res([
          { id: '10010', name: '张三', org: '上海福田中心', positionId: 'pb1001', positionNm: '客户经理' },
          { id: '10010', name: '张三', org: '上海福田中心', positionId: 'pb1002', positionNm: '客户经理助理' },
          { id: '10010', name: '张三', org: '上海福田中心', positionId: 'pb1003', positionNm: '私行客户经理' },
          { id: '10011', name: '李四', org: '上海福田中心', positionId: 'pb1003', positionNm: '私行客户经理' },
          { id: '10012', name: '王五', org: '上海福田中心', positionId: 'pb1003', positionNm: '私行客户经理' }
        ]);
      }, 100);
    }).then(res => {
      const list = res.map(x => ({
        ...x,
        label: `${x.name ?? '--'}/${x.id ?? '--'}`,
        value: `${x.id}/${x.positionId}`,
        key: getKey(x)
      }));

      setApiMngList(showPosition ? list : uniqBy(list, x => x.id));
    });
  };
  useEffect(() => {
    visible && getMngList();
  }, [visible, getMngList]);

  const realMngList = useMemo(() => {
    if (mngList) return mngList;
    return apiMngList;
  }, [mngList, apiMngList]);
  const filteredMngList = useMemo(() => {
    return realMngList.filter(x => x.label.includes(keywords));
  }, [realMngList, keywords]);

  const handleCellOnClick = item => {
    if (disabledKeys.includes(item.key)) return;
    const isRemove = selectedKeys.includes(item.key);

    if (!multiple) {
      return setSelectedKeys([item.key]);
    }
    const filterItemList = selectedKeys.filter(x => x !== item.key);
    setSelectedKeys(isRemove ? filterItemList : [...filterItemList, item.key]);
  };
  const handleOnSubmit = () => {
    const selectedItems = realMngList.filter(x => selectedKeys.includes(x.key));
    setSelectedItems(selectedItems);
    onSubmit?.(multiple ? selectedItems : selectedItems?.[0]);
  };
  const onClosed = () => {
    setSelectedKeys([]);
    setKeywords('');
    setSelectedItems([]);
  };
  return (
    <>
      <Popup
        visible={visible}
        position="right"
        onClosed={onClosed}
        style={{
          height: '100%',
          width: '100%'
        }}
      >
        <div className="head">
          <NavBar onClickLeft={onClose} title="选择客户经理" rightText="确定" onClickRight={handleOnSubmit} />
          <Search value={keywords} onChange={setKeywords} />
        </div>
        <List>
          {filteredMngList.map(mng => (
            <Cell
              key={mng.key}
              icon={<Checkbox checked={selectedKeys.includes(mng.key)} disabled={disabledKeys.includes(mng.key)} />}
              clickable
              title={mng.label}
              label={mng.org}
              onClick={() => handleCellOnClick(mng)}
            />
          ))}
        </List>
      </Popup>
    </>
  );
}

export default CustMngSelectPopup;
