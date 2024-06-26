import { useCallback, useEffect, useState } from 'react';
import { useIMask } from 'react-imask';
import styled from '@emotion/styled';
import { DateTime } from 'luxon';

import { DATE_BLOCKS } from '@/ui/input/components/internal/date/constants/DateBlocks';
import { DATE_MASK } from '@/ui/input/components/internal/date/constants/DateMask';
import { DATE_TIME_BLOCKS } from '@/ui/input/components/internal/date/constants/DateTimeBlocks';
import { DATE_TIME_MASK } from '@/ui/input/components/internal/date/constants/DateTimeMask';
import { MAX_DATE } from '@/ui/input/components/internal/date/constants/MaxDate';
import { MIN_DATE } from '@/ui/input/components/internal/date/constants/MinDate';

const StyledInputContainer = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  height: ${({ theme }) => theme.spacing(8)};
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  background: ${({ theme }) => theme.background.secondary};
  border: none;
  color: ${({ theme }) => theme.font.color.primary};
  outline: none;
  padding: 8px;
  font-weight: 500;
  font-size: ${({ theme }) => theme.font.size.md};
  width: 100%;
  color: ${({ hasError, theme }) => (hasError ? theme.color.red : 'inherit')};
`;

type DateTimeInputProps = {
  onChange?: (date: Date | null) => void;
  date: Date | null;
  isDateTimeInput?: boolean;
  onError?: (error: Error) => void;
};

export const DateTimeInput = ({
  date,
  onChange,
  isDateTimeInput,
}: DateTimeInputProps) => {
  const parsingFormat = isDateTimeInput ? 'MM/dd/yyyy HH:mm' : 'MM/dd/yyyy';

  const [hasError, setHasError] = useState(false);

  const parseDateToString = useCallback(
    (date: any) => {
      const dateParsed = DateTime.fromJSDate(date);

      const formattedDate = dateParsed.toFormat(parsingFormat);

      return formattedDate;
    },
    [parsingFormat],
  );

  const parseStringToDate = (str: string) => {
    setHasError(false);

    const parsedDate = isDateTimeInput
      ? DateTime.fromFormat(str, parsingFormat)
      : DateTime.fromFormat(str, parsingFormat, { zone: 'utc' });

    const isValid = parsedDate.isValid;

    if (!isValid) {
      setHasError(true);

      return null;
    }

    const jsDate = parsedDate.toJSDate();

    return jsDate;
  };

  const pattern = isDateTimeInput ? DATE_TIME_MASK : DATE_MASK;
  const blocks = isDateTimeInput ? DATE_TIME_BLOCKS : DATE_BLOCKS;

  const { ref, setValue, value } = useIMask(
    {
      mask: Date,
      pattern,
      blocks,
      min: MIN_DATE,
      max: MAX_DATE,
      format: parseDateToString,
      parse: parseStringToDate,
      lazy: false,
      autofix: true,
    },
    {
      onComplete: (value) => {
        const parsedDate = parseStringToDate(value);

        onChange?.(parsedDate);
      },
      onAccept: () => {
        setHasError(false);
      },
    },
  );

  useEffect(() => {
    setValue(parseDateToString(date));
  }, [date, setValue, parseDateToString]);

  return (
    <StyledInputContainer>
      <StyledInput
        type="text"
        ref={ref as any}
        placeholder={`Type date${
          isDateTimeInput ? ' and time' : ' (mm/dd/yyyy)'
        }`}
        value={value}
        onChange={() => {}} // Prevent React warning
        hasError={hasError}
      />
    </StyledInputContainer>
  );
};
