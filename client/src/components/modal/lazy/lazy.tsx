import useModal from "@/components/modal/hooks/useModal";
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

    const Component = dynamic<IDynamicComponent>(
        () => import(`../../modals/${filename}/${filename}.tsx`),
    );

    return <Component onClose={onClose} />;
};

export default Lazy;
