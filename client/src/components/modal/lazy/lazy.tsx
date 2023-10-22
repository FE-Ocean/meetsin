import useModal from "@/hooks/useModal";
import dynamic from "next/dynamic";

interface ILazy {
    filename: string;
}

interface IDynamicComponent {
    onClose: () => void;
}

const Lazy = (props: ILazy) => {
    const { filename } = props;

    const { onClose } = useModal(filename);

    const handleModalClose = () => {
        onClose();
    };

    const Component = dynamic<IDynamicComponent>(() => import(`../${filename}/${filename}.tsx`));

    return <Component onClose={handleModalClose} />;
};

export default Lazy;
