import { uniqBy } from 'lodash-es';
import { Fragment, useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Cell, Checkbox, List, NavBar, Popup, Search, Tag } from 'react-vant';
import './index.less';
import { useRestState } from './hooks';
function CustMngSelectPopup({
  //手动传入mngList
  mngList,
  //是否多选
  multiple = false,
  //默认选中的key, key为uid；当需要开启showPosition时，key为uid/pid
  defaultSelectedKeys = [],
  //禁止选中的key, key为uid；当需要开启showPosition时，key为uid/pid
  disabledKeys = [],
  //是否有中间停留的popup页面
  simple = false,
  //是否区分岗位
  showPosition = false,
  visible,
  onClose,
  onSubmit
}) {
  //选择客户经理实际弹窗visible
  const [pageVisible, setPageVisible] = useState(false);
  //内置api的客户经理列表
  const [apiMngList, setApiMngList] = useState([]);
  //选中的keys
  const [selectedKeys, setSelectedKeys, resetSelectedKeys, lockDefaultSelectedKeys] = useRestState(defaultSelectedKeys);
  const [keywords, setKeywords] = useState('');
  // 获取当前数据key，根据是否展示岗位的情况，key会有所不同
  const getKey = item => (showPosition ? `${item.id}/${item.positionId}` : item.id);

  const getMngList = () => {
    // 如果有传入mngList，api不调用
    if (mngList) return;
    return new Promise(res => {
      setTimeout(() => {
        res([
          { id: '10010', name: '张三', org: '上海福田中心', positionId: 'a1001', positionNm: '客户经理' },
          { id: '10010', name: '张三', org: '上海福田中心', positionId: 'a1002', positionNm: '客户经理助理' },
          { id: '10010', name: '张三', org: '上海福田中心', positionId: 'a1003', positionNm: '私行客户经理' },
          { id: '10011', name: '李四', org: '上海福田中心', positionId: 'a1003', positionNm: '私行客户经理' },
          { id: '10012', name: '王五', org: '上海福田中心', positionId: 'a1003', positionNm: '私行客户经理' },
          ...Array.from({ length: 50 }, (_, ind) => ({
            id: String(10013 + ind),
            name: '测试人员' + (ind + 1),
            org: '上海福田中心',
            positionId: 'a1001',
            positionNm: '客户经理'
          }))
        ]);
      }, 100);
    }).then(res => {
      const list = res.map(x => ({
        ...x,
        label: `${x.name ?? '--'}/${x.id ?? '--'}`,
        value: `${x.id}/${x.positionId}`,
        key: getKey(x)
      }));
      //如果不展示岗位号，需要进行数据去重
      setApiMngList(showPosition ? list : uniqBy(list, x => x.id));
    });
  };
  //api获取客户经理列表
  useEffect(() => {
    visible && !apiMngList.length && getMngList();
  }, [visible]);

  //实际的客户经理列表，根据是否传入mngList决定
  const realMngList = useMemo(() => {
    if (mngList) return mngList;
    return apiMngList;
  }, [mngList, apiMngList]);
  //根据关键词过滤后的客户经理列表
  const filteredMngList = useMemo(() => {
    return realMngList.filter(x => x.label.includes(keywords));
  }, [realMngList, keywords]);

  // selectedItems同步变化
  const selectedItems = useMemo(
    () => realMngList.filter(x => selectedKeys.includes(x.key)),
    [selectedKeys, realMngList]
  );

  //cell点击监听
  const handleCellOnClick = item => {
    if (disabledKeys.includes(item.key)) return;
    const isRemove = selectedKeys.includes(item.key);

    if (!multiple) {
      return setSelectedKeys([item.key]);
    }
    const filterItemList = selectedKeys.filter(x => x !== item.key);
    setSelectedKeys(isRemove ? filterItemList : [...filterItemList, item.key]);
  };
  // 提交处理
  const handleOnSubmit = values => {
    const res = values ?? selectedItems;
    onSubmit?.(multiple ? res : res?.[0]);
  };
  const handlePageOnSubmit = () => {
    const newSelectedItems = realMngList.filter(x => selectedKeys.includes(x.key));
    setPageVisible(false);
    simple && handleOnSubmit(newSelectedItems);
  };

  //弹窗完全关闭后数据重置处理
  const handlePageOnClosed = () => {
    if (simple) {
      setSelectedKeys(defaultSelectedKeys);
      setKeywords('');
      return;
    }
    setKeywords('');
  };

  //客户经理弹窗点击关闭按钮
  const handlePageOnClose = () => {
    resetSelectedKeys();
    simple && onClose?.();
    !simple && setPageVisible(false);
  };
  //中间层,关闭按钮监听
  const handleOnClose = () => {
    setSelectedKeys(defaultSelectedKeys);
    onClose?.();
  };

  //中间层-选择的数据
  const selectedValue = useMemo(
    () =>
      !selectedItems.length ? (
        '请选择'
      ) : (
        <div>
          {selectedItems.slice(0, 3).map(item => (
            <Fragment key={item.key}>
              {item.label}
              {showPosition && `/${item.positionNm}`}
              <br />
            </Fragment>
          ))}
          {selectedItems.length > 3 && <span>...</span>}
        </div>
      ),
    [selectedItems, showPosition]
  );

  return (
    <>
      <Popup
        visible={!simple && visible}
        position="bottom"
        title="客户经理"
        round
        closeable
        onClickCloseIcon={handleOnClose}
        className="middle-popup"
        style={{
          height: '45%'
        }}
      >
        <div className="content">
          <Cell
            isLink
            title="客户经理"
            titleStyle={{ flex: 0, minWidth: '4em', height: '100%', display: 'flex', alignItems: 'center' }}
            onClick={() => setPageVisible(true)}
            value={selectedValue}
          />
          <div className="btn-group">
            <Button block type="primary" onClick={() => handleOnSubmit()}>
              确定选择
            </Button>
          </div>
        </div>
      </Popup>

      <Popup
        visible={pageVisible || (simple && visible)}
        position="right"
        onOpen={() => lockDefaultSelectedKeys()}
        className="page"
        onClosed={handlePageOnClosed}
        style={{
          height: '100%',
          width: '100%'
        }}
      >
        <div className="head">
          <NavBar
            onClickLeft={handlePageOnClose}
            title="选择客户经理"
            rightText="确定"
            onClickRight={handlePageOnSubmit}
          />
          <Search value={keywords} onChange={setKeywords} />
        </div>
        <List className="list">
          {filteredMngList.map(mng => (
            <Cell
              key={mng.key}
              icon={<Checkbox checked={selectedKeys.includes(mng.key)} disabled={disabledKeys.includes(mng.key)} />}
              clickable
              title={
                <span>
                  {mng.label} {showPosition && <Tag>{mng.positionNm}</Tag>}
                </span>
              }
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
