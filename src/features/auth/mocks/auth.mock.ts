import { mockDelay } from '@/shared/mock/delay';
import type { MockScenarioDefinition } from '@/shared/mock';

export const MOCK_VERIFICATION_CODE = '000000';

export interface MockVerificationRequest {
  requestId: string;
  phone: string;
  expiresInSeconds: number;
  resendAfterSeconds: number;
}

export async function requestMockVerification(
  phone: string,
  scenario?: MockScenarioDefinition,
): Promise<MockVerificationRequest> {
  await mockDelay();

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error('أدخل رقم هاتف صالحاً بعد اختيار الدولة.');
  }

  if (scenario?.flags?.authResendThrottled) {
    throw new Error('إعادة إرسال الرمز متاحة بعد انتهاء مهلة الانتظار الحالية.');
  }

  return {
    requestId: 'mock-verification-request',
    phone,
    expiresInSeconds: 120,
    resendAfterSeconds: 30,
  };
}

export async function verifyMockCode(
  code: string,
  scenario?: MockScenarioDefinition,
): Promise<void> {
  await mockDelay();

  if (!/^\d{6}$/.test(code)) {
    throw new Error('أدخل رمز التحقق المكوّن من ستة أرقام.');
  }

  if (code !== MOCK_VERIFICATION_CODE) {
    throw new Error('رمز التحقق غير صحيح.');
  }

  if (scenario?.flags?.authChallengeExpired) {
    throw new Error('انتهت صلاحية رمز التحقق. اطلب رمزاً جديداً للمتابعة.');
  }

  if (scenario?.flags?.authAttemptLimit) {
    throw new Error('تم بلوغ حد محاولات التحقق لهذا الرمز. اطلب رمزاً جديداً.');
  }

  if (scenario?.flags?.authChallengeUsed) {
    throw new Error('تم استخدام رمز التحقق هذا سابقاً ولا يمكن استعماله مرة ثانية.');
  }
}
