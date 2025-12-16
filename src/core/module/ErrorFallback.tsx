import { Button } from "@mui/material";

interface ErrorFallbackProps {
  error: any;
  resetErrorBoundary: () => void;
}


export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div role="alert">
      <p>😢 Ocurrió un error:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <Button variant="contained" onClick={resetErrorBoundary}>
        Reintentar
      </Button>
    </div>
  );
}