import SubscriberModal from "../modals/subscriberModal";
import DebitDetailsModal from "../modals/debitDetails";
import DetailsModal from "../modals/details";
import CameraScreen from "../modals/camera"; // توجه: مسیر را اصلاح کردم به modals/camera
// اگر map.tsx هم دارید:
// import MapScreen from "../modals/map";

interface ModalsContainerProps {
  modalStates: {
    isModalOpen: boolean;
    isDetailsModalOpen: boolean;
    isDebitDetailsModalOpen: boolean;
    isCameraActive: boolean;
    mapVisible: boolean;
  };
  setModalStates: (value: any) => void;
  subscriber: any;
}

export const ModalsContainer = ({ modalStates, setModalStates, subscriber }: ModalsContainerProps) => {
  return (
    <>
      {modalStates.isModalOpen && (
        <SubscriberModal
          data={subscriber}
          isVisible={modalStates.isModalOpen}
          close={() => setModalStates((prev: any) => ({ ...prev, isModalOpen: false }))}
        />
      )}

      {modalStates.isDetailsModalOpen && (
        <DetailsModal
          data={subscriber}
          isVisible={modalStates.isDetailsModalOpen}
          close={() => setModalStates((prev: any) => ({ ...prev, isDetailsModalOpen: false }))}
        />
      )}

      {modalStates.isDebitDetailsModalOpen && (
        <DebitDetailsModal
          data={subscriber}
          isVisible={modalStates.isDebitDetailsModalOpen}
          close={() => setModalStates((prev: any) => ({ ...prev, isDebitDetailsModalOpen: false }))}
        />
      )}

      {/* تصحیح شده: اضافه کردن props مورد نیاز CameraScreen */}
      {modalStates.isCameraActive && (
        <CameraScreen
          visible={modalStates.isCameraActive}
          onClose={() => setModalStates((prev: any) => ({ ...prev, isCameraActive: false }))}
          onCapture={(uri: string) => {
            console.log('عکس گرفته شد:', uri);
            setModalStates((prev: any) => ({ ...prev, isCameraActive: false }));
          }}
        />
      )}

      {/* اگر نقشه هم می‌خواهید اینجا اضافه کنید */}
      {/* {modalStates.mapVisible && (
        <MapScreen
          data={subscriber}
          isVisible={modalStates.mapVisible}
          close={() => setModalStates((prev: any) => ({ ...prev, mapVisible: false }))}
        />
      )} */}
    </>
  );
};