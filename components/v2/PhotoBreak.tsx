type PhotoBreakProps = {
  src: string;
  alt: string;
};

export function PhotoBreak({ src, alt }: PhotoBreakProps) {
  return (
    <section
      role="img"
      aria-label={alt}
      className="relative h-[33vh] min-h-48 w-screen overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundAttachment: "fixed", backgroundImage: `url("${src}")`, marginLeft: "calc(50% - 50vw)" }}
    >
      <div className="absolute inset-0 bg-[#21140f]/15" aria-hidden="true" />
    </section>
  );
}
