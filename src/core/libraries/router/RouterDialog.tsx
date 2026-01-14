
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
    </>
  );
}
