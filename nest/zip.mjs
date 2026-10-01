const encoder = new TextEncoder();

function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let i = 0; i < 8; i++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function write16(view, offset, value) { view.setUint16(offset, value, true); }
function write32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }
function join(parts) {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const result = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}

export function makeZip(files) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.content);
    const checksum = crc32(data);
    const header = new Uint8Array(30 + name.length);
    const lh = new DataView(header.buffer);
    write32(lh, 0, 0x04034b50);
    write16(lh, 4, 20);
    write16(lh, 6, 0x0800);
    write16(lh, 8, 0);
    write16(lh, 10, 0);
    write16(lh, 12, 0x0021);
    write32(lh, 14, checksum);
    write32(lh, 18, data.length);
    write32(lh, 22, data.length);
    write16(lh, 26, name.length);
    write16(lh, 28, 0);
    header.set(name, 30);
    local.push(header, data);

    const listing = new Uint8Array(46 + name.length);
    const cd = new DataView(listing.buffer);
    write32(cd, 0, 0x02014b50);
    write16(cd, 4, 20);
    write16(cd, 6, 20);
    write16(cd, 8, 0x0800);
    write16(cd, 10, 0);
    write16(cd, 12, 0);
    write16(cd, 14, 0x0021);
    write32(cd, 16, checksum);
    write32(cd, 20, data.length);
    write32(cd, 24, data.length);
    write16(cd, 28, name.length);
    write16(cd, 30, 0);
    write16(cd, 32, 0);
    write16(cd, 34, 0);
    write16(cd, 36, 0);
    write32(cd, 38, 0);
    write32(cd, 42, offset);
    listing.set(name, 46);
    central.push(listing);
    offset += header.length + data.length;
  }
  const centralBytes = join(central);
  const end = new Uint8Array(22);
  const directory = new DataView(end.buffer);
  write32(directory, 0, 0x06054b50);
  write16(directory, 4, 0);
  write16(directory, 6, 0);
  write16(directory, 8, files.length);
  write16(directory, 10, files.length);
  write32(directory, 12, centralBytes.length);
  write32(directory, 16, offset);
  write16(directory, 20, 0);
  return join([...local, centralBytes, end]);
}
