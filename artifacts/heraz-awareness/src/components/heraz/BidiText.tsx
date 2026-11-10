export function BidiText({ text }: { text: string }) {
  const segments = text.split(/([A-Za-z0-9]+(?:[.,:/-][A-Za-z0-9]+)*)/g);
  return (
    <>
      {segments.map((segment, index) =>
        /^[A-Za-z0-9]/.test(segment)
          ? <bdi key={index} dir="ltr">{segment}</bdi>
          : <span key={index}>{segment}</span>,
      )}
    </>
  );
}
