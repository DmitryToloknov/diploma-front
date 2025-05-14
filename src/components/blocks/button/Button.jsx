import {Button} from "@gravity-ui/uikit";
import React from "react";


export function DefaultButton({ width, size, value, onClick, loading, action}) {
    return <Button loading={loading} width={width} view={action || 'action'}  size={size}  onClick={onClick}>{value}</Button>
}