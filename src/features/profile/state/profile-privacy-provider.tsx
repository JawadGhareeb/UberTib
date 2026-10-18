import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export type ConsentStatus = 'active' | 'inactive' | 'withdrawn' | 'restricted';
export type DataExportStatus = 'not-requested' | 'preparing' | 'ready' | 'expired' | 'failure';
export type AccountClosureStatus =
  | 'idle'
  | 'reverify'
  | 'confirm'
  | 'submitting'
  | 'requested'
  | 'review'
  | 'scheduled'
  | 'closed'
  | 'failure';

export interface ConsentHistoryEntry {
  id: string;
  version: string;
  action: 'accepted' | 'withdrawn';
  atLabel: string;
}

export interface PrivacyConsent {
  id: string;
  title: string;
  purpose: string;
  status: ConsentStatus;
  version: string;
  acceptedAtLabel: string;
  lastUpdatedLabel: string;
  withdrawalAllowed: boolean;
  newVersion?: {
    version: string;
    summary: string;
  };
  history: ConsentHistoryEntry[];
}

export interface AccountSession {
  id: string;
  label: string;
  locationLabel: string;
  activityLabel: string;
  current: boolean;
  trusted: boolean;
}

interface ProfilePrivacyContextValue {
  securityMethod: string;
  setSecurityMethod: (value: string) => void;
  sessions: AccountSession[];
  endSession: (sessionId: string) => void;
  endOtherSessions: () => void;
  consents: PrivacyConsent[];
  getConsent: (consentId?: string) => PrivacyConsent | undefined;
  withdrawConsent: (consentId: string) => void;
  dataExportStatus: DataExportStatus;
  requestDataExport: () => void;
  setDataExportStatus: (status: DataExportStatus) => void;
  accountClosureStatus: AccountClosureStatus;
  setAccountClosureStatus: (status: AccountClosureStatus) => void;
}

const initialConsents: PrivacyConsent[] = [
  {
    id: 'image-analysis',
    title: 'استخدام الصور للتحليل',
    purpose: 'دعم التحليل الأولي ضمن هذا الغرض فقط، ولا تستبدل الصور التشخيص السريري.',
    status: 'active',
    version: '2.1',
    acceptedAtLabel: '18 أيلول 2026، 11:24 ص',
    lastUpdatedLabel: '20 أيلول 2026',
    withdrawalAllowed: true,
    newVersion: {
      version: '2.2',
      summary: 'يوضّح مدة الاستخدام. لن يحل محل قبول 2.1 إلا بعد مراجعتك وموافقتك.',
    },
    history: [
      { id: 'image-v21', version: '2.1', action: 'accepted', atLabel: '18 أيلول 2026، 11:24 ص' },
      { id: 'image-v18', version: '1.8', action: 'withdrawn', atLabel: '2 آذار 2025، 4:18 م' },
    ],
  },
  {
    id: 'radiographs-care',
    title: 'الأشعة لخدمة الرعاية',
    purpose: 'استخدام الأشعة ضمن رحلة الرعاية المرتبطة بالحالة العلاجية.',
    status: 'active',
    version: '1.4',
    acceptedAtLabel: '18 أيلول 2026',
    lastUpdatedLabel: '20 أيلول 2026',
    withdrawalAllowed: false,
    history: [{ id: 'xray-v14', version: '1.4', action: 'accepted', atLabel: '18 أيلول 2026' }],
  },
  {
    id: 'preliminary-analysis',
    title: 'التحليل الأولي',
    purpose: 'السماح باستخدام الإجابات والملفات لتوجيه الخطوة التالية دون إصدار تشخيص نهائي.',
    status: 'active',
    version: '3.0',
    acceptedAtLabel: '20 أيلول 2026',
    lastUpdatedLabel: '20 أيلول 2026',
    withdrawalAllowed: true,
    history: [{ id: 'analysis-v30', version: '3.0', action: 'accepted', atLabel: '20 أيلول 2026' }],
  },
  {
    id: 'product-improvement',
    title: 'تحسين المنتج والخدمة',
    purpose: 'استخدام بيانات مسموحة لتحسين تجربة المنتج والخدمة.',
    status: 'inactive',
    version: '1.2',
    acceptedAtLabel: '—',
    lastUpdatedLabel: '20 أيلول 2026',
    withdrawalAllowed: false,
    history: [],
  },
  {
    id: 'deidentified-data',
    title: 'استخدام بيانات منزوعة الهوية',
    purpose: 'استخدام بيانات منزوعة الهوية للأغراض المبيّنة في سياسة الموافقة.',
    status: 'active',
    version: '1.1',
    acceptedAtLabel: '18 أيلول 2026',
    lastUpdatedLabel: '20 أيلول 2026',
    withdrawalAllowed: true,
    history: [
      { id: 'deidentified-v11', version: '1.1', action: 'accepted', atLabel: '18 أيلول 2026' },
    ],
  },
];

const initialSessions: AccountSession[] = [
  {
    id: 'current-device',
    label: 'هذا الجهاز · iPhone 15',
    locationLabel: 'دمشق',
    activityLabel: 'نشط الآن',
    current: true,
    trusted: true,
  },
  {
    id: 'windows-chrome',
    label: 'Chrome على Windows',
    locationLabel: 'حلب',
    activityLabel: 'آخر نشاط: 18 أيلول 2026، 8:42 م',
    current: false,
    trusted: false,
  },
];

const ProfilePrivacyContext = createContext<ProfilePrivacyContextValue | null>(null);

export function ProfilePrivacyProvider({ children }: PropsWithChildren) {
  const [securityMethod, setSecurityMethod] = useState('رمز دخول مفعّل');
  const [sessions, setSessions] = useState<AccountSession[]>(initialSessions);
  const [consents, setConsents] = useState<PrivacyConsent[]>(initialConsents);
  const [dataExportStatus, setDataExportStatus] = useState<DataExportStatus>('not-requested');
  const [accountClosureStatus, setAccountClosureStatus] = useState<AccountClosureStatus>('idle');

  const value = useMemo<ProfilePrivacyContextValue>(
    () => ({
      securityMethod,
      setSecurityMethod,
      sessions,
      endSession: (sessionId) => {
        setSessions((current) =>
          current.filter((session) => session.current || session.id !== sessionId),
        );
      },
      endOtherSessions: () => {
        setSessions((current) => current.filter((session) => session.current));
      },
      consents,
      getConsent: (consentId) => consents.find((consent) => consent.id === consentId),
      withdrawConsent: (consentId) => {
        setConsents((current) =>
          current.map((consent) =>
            consent.id === consentId && consent.withdrawalAllowed
              ? {
                  ...consent,
                  status: 'withdrawn',
                  history: [
                    {
                      id: `${consent.id}-withdrawn-session`,
                      version: consent.version,
                      action: 'withdrawn',
                      atLabel: 'الآن',
                    },
                    ...consent.history,
                  ],
                }
              : consent,
          ),
        );
      },
      dataExportStatus,
      requestDataExport: () => setDataExportStatus('preparing'),
      setDataExportStatus,
      accountClosureStatus,
      setAccountClosureStatus,
    }),
    [accountClosureStatus, consents, dataExportStatus, securityMethod, sessions],
  );

  return <ProfilePrivacyContext.Provider value={value}>{children}</ProfilePrivacyContext.Provider>;
}

export function useProfilePrivacy(): ProfilePrivacyContextValue {
  const value = useContext(ProfilePrivacyContext);

  if (!value) {
    throw new Error('useProfilePrivacy must be used inside ProfilePrivacyProvider');
  }

  return value;
}
