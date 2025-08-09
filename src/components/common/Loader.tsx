import React from "react";

const Loader = () => {
  return (
    <div className="w-full py-24 flex items-center justify-center">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-primary"
        aria-label="Carregando"
      />
    </div>
  );
};

export default Loader;
