import {Dialog} from "@gravity-ui/uikit";

export default function DeleteDialog({
                                         open,
                                         setOpen,
                                         caption = "Подтверждение",
                                         body,
                                         onClick,
                                         textButtonApply = "Да",
                                         textButtonCancel = "Отмена",
                                         loading
}) {
    const dialogTitleId = "deleteDialog";
    return (
        <Dialog
            onClose={() => setOpen(false)}
            open={open}
            aria-labelledby={dialogTitleId}
        >
            <Dialog.Header caption={caption}/>
            <Dialog.Body>{body}</Dialog.Body>
            <Dialog.Footer
                loading={loading}
                onClickButtonCancel={() => setOpen(false)}
                onClickButtonApply={onClick}
                textButtonApply={textButtonApply}
                textButtonCancel={textButtonCancel}
            />
        </Dialog>
    )
}