import { BaseModal } from "../baseModal/baseModal";

interface ITestModal {
    onClose: () => void;
}

const TestModal = (props: ITestModal) => {
    const { onClose } = props;

    return (
        <BaseModal onClose={onClose}>
            <div style={{ width: "300px", height: "300px", backgroundColor: "red" }}>
                테스트모달
            </div>
        </BaseModal>
    );
};

export default TestModal;
