import React from "react";
import {Outlet} from "react-router-dom";

/**
 * router dialog props
 */
interface RouterDialogProps {
  component: any;
}

/**
 * router dialog
 *
 * @param component
 */
export default function RouterDialog({ component }: RouterDialogProps) {
  return (
    <>
      {component}
      <Outlet />
    </>
  );
}
