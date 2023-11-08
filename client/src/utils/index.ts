/**
 * ISO 형식으로 된 시간을 23:22 형식으로 바꿔주는 함수입니다.
 */
export const formatTimeFromISO = (isoString: string) => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

export const numberToString = (num: number) => {
    return String(num).padStart(2, "0");
};
