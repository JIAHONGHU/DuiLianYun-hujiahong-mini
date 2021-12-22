import Dialog from '../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../miniprogram_npm/@vant/weapp/notify/notify';

export const dialogConfirm = ({message}) => {
  return new Promise((resolve) => {
      Dialog.confirm({
        message: message,
      }).then(() => {
        resolve(true);
      }).catch(() => {
        resolve(false);
      })
    }
  )
}

export const toast = (params) => {
  return new Promise((resolve) => {
      Toast({
        ...params,
        duration: 1000
      });
    }
  )
}

export const notify = ({message, top}) => {
  return new Promise((resolve) => {
      Notify({
        message: message,
        safeAreaInsetTop: true,
        top: top,
        background: "#faae58",
        duration: 1000
      });
    }
  )
}