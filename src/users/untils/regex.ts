export function diacriticSensitiveRegex(string = '') {
  return string
    .replace(/a/g, '[a,ă,â,á,ắ,ấ,à,ằ,ầ,ả,ẳ,ẩ,ã,ẵ,ẫ,ạ,ặ,ậ]')
    .replace(/e/g, '[e,ê,é,ế,è,ề,ẻ,ể,ẽ,ễ,ẹ,ệ]')
    .replace(/i/g, '[i,í,ì,ỉ,ĩ,ị]')
    .replace(/o/g, '[o,ô,ơ,ó,ố,ơ,ò,ồ,ờ,ỏ,ổ,ở,õ,ỗ,ỡ,ọ,ộ,ợ]')
    .replace(/u/g, '[u,ư,ú,ứ,ù,ừ,ủ,ử,ũ,ữ,ụ,ự]')
    .replace(/y/g, '[y,ý,ỳ,ỷ,ỹ,ỵ]')
    .replace(/d/g, '[d,đ]')
    .replace(/A/g, '[A,Ă,Â,Á,Ắ,Ấ,À,Ằ,Ầ,Ả,Ẳ,Ẩ,Ã,Ẵ,Ẫ,Ạ,Ặ,Ậ]')
    .replace(/E/g, '[E,Ê,É,Ế,È,Ề,Ẻ,Ể,Ẽ,Ễ,Ẹ,Ệ]')
    .replace(/I/g, '[I,Í,Ì,Ỉ,Ĩ,Ị]')
    .replace(/O/g, '[O,Ô,Ơ,Ó,Ố,Ớ,Ò,Ồ,Ờ,Ỏ,Ổ,Ở,Õ,Ỗ,Ỡ,Ọ,Ộ,Ợ]')
    .replace(/U/g, '[U,Ư,Ú,Ứ,Ù,Ừ,Ủ,Ử,Ũ,Ữ,Ụ,Ự]')
    .replace(/Y/g, '[Y,Ý,Ỳ,Ỷ,Ỹ,Ỵ]')
    .replace(/D/g, '[D,Đ]');
}

export function accentsTidy(string = '') {
  return string
    .replace(/[a,ă,â,á,ắ,ấ,à,ằ,ầ,ả,ẳ,ẩ,ã,ẵ,ẫ,ạ,ặ,ậ]/g, 'a')
    .replace(/[e,ê,é,ế,è,ề,ẻ,ể,ẽ,ễ,ẹ,ệ]/g, 'e')
    .replace(/[i,í,ì,ỉ,ĩ,ị]/g, 'i')
    .replace(/[o,ô,ơ,ó,ố,ơ,ò,ồ,ờ,ỏ,ổ,ở,õ,ỗ,ỡ,ọ,ộ,ợ]/g, 'o')
    .replace(/[u,ư,ú,ứ,ù,ừ,ủ,ử,ũ,ữ,ụ,ự]/g, 'u')
    .replace(/[y,ý,ỳ,ỷ,ỹ,ỵ]/g, 'y')
    .replace(/[d,đ]/g, 'd')
    .replace(/[A,Ă,Â,Á,Ắ,Ấ,À,Ằ,Ầ,Ả,Ẳ,Ẩ,Ã,Ẵ,Ẫ,Ạ,Ặ,Ậ]/g, 'A')
    .replace(/[E,Ê,É,Ế,È,Ề,Ẻ,Ể,Ẽ,Ễ,Ẹ,Ệ]/g, 'E')
    .replace(/[I,Í,Ì,Ỉ,Ĩ,Ị]/g, 'I')
    .replace(/[O,Ô,Ơ,Ó,Ố,Ớ,Ò,Ồ,Ờ,Ỏ,Ổ,Ở,Õ,Ỗ,Ỡ,Ọ,Ộ,Ợ]/g, 'O')
    .replace(/[U,Ư,Ú,Ứ,Ù,Ừ,Ủ,Ử,Ũ,Ữ,Ụ,Ự]/g, 'U')
    .replace(/[Y,Ý,Ỳ,Ỷ,Ỹ,Ỵ]/g, 'U')
    .replace(/[D,Đ]/g, 'D');
}
