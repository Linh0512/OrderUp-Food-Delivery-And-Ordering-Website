export const formatDateVN = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateVN1 = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "";
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const formatDateVN2 = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "";
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${year}-${month}-${day}`;
};

export const formatCurrencyVN = (amount) => {
  const number = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.-]/g, '')) : amount;
  
  if (isNaN(number)) {
    return "0 VNĐ";
  }
  
  return number.toLocaleString('vi-VN') + ' VNĐ';
};