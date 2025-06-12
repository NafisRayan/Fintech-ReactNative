export function decimalNumberWithCommas(number:  number) {
  const options = {
    style: "decimal",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  };
  let emptyValue = 0
  let formattedWithOptions = ""
  
  if (!number) {
     formattedWithOptions = emptyValue.toLocaleString("en-US", options);
  } else {
      formattedWithOptions = number.toLocaleString("en-US", options);
  }

  return formattedWithOptions;
}