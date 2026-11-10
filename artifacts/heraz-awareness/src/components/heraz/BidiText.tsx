export function BidiText({ text }: { text: string }) {
  const segments = text.split(/([A-Za-z0-9]+(?:[ \t\u00a0]+[A-Za-z0-9]+)*(?:[.,:/-][A-Za-z0-9]+)*)/g);
  return (
    <>
      {segments.map((segment, index) =>
        /[A-Za-z0-9]/.test(segment)
          ? <bdi key={index} dir="ltr" style={{ unicodeBidi: 'isolate' }}>{segment}</bdi>
          : segment,
      )}
    </>
  );
}
