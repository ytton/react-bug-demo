import { useState } from 'react';
import './App.css';
import { Button, Toast } from 'react-vant';
import CustMngSelectPopup from './components/custMngSelectPopup';

function App() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="card">
        <Button onClick={() => setVisible(true)}>选择客户经理</Button>
      </div>
      <CustMngSelectPopup
        onSubmit={item => {
          if (!item) {
            return Toast.fail('请选择客户经理');
          }
          console.log(item);
          setVisible(false);
        }}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
}

export default App;
