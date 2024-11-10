import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

export type AlertMessage = {
  severity: 'success' | 'danger';
  body: string;
}

type AlertProps = {
  message: AlertMessage;
  messageSetter: Dispatch<SetStateAction<AlertMessage | null>>;
  duration?: number;
}

export function Alert({ message, messageSetter, duration = 10000 }: AlertProps) {
  useEffect(() => {
    setTimeout(() => {
      messageSetter(null);
    }, duration);
  }, []);

  return (
    <>
      {!!message.body && (
        <div className={`alert alert-${message.severity}`} role="alert">
          {message.body}
        </div>
      )}
    </>
  );
}
