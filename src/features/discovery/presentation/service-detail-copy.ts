import type { PenServiceFamily } from './pen-discovery-data';

export interface ServiceDetailCopy {
  title: string;
  description: string;
  whenToConsider: string;
  planNote: string;
  preparationNote: string;
}

/** Patient-friendly copy varies by service while the layout stays consistent. */
export function getServiceDetailCopy(family: PenServiceFamily): ServiceDetailCopy {
  if (family.id === 'root-canal') {
    return {
      title: 'العلاج الأولي لقنوات الجذر',
      description: 'يساعد على الحفاظ على السن عندما تحتاج الأنسجة الداخلية تقييماً وعناية متخصصة.',
      whenToConsider:
        'إذا كان السن بحاجة إلى تقييم قنواته ولم يسبق علاجه جذرياً. الطبيب يحدد إن كان علاج الجذور مناسباً.',
      planNote: 'حالة السن وصورته وإمكانية ترميمه لاحقاً قد تغيّر الخطة بعد الفحص.',
      preparationNote: 'صورة سابقة أو تقرير إحالة إذا توفر؛ مو شرط حتى تبدأ البحث عن طبيب.',
    };
  }

  return {
    title: family.title,
    description: family.description,
    whenToConsider:
      family.id === 'implant-prosthetics'
        ? 'إذا عندك زرعة جاهزة للتركيب، أو عم تستكشف تعويض أسنان مفقودة. الطبيب يفحص ثبات الزرعات واللثة والإطباق قبل اقتراح الخطة.'
        : 'إذا كانت هالخدمة الأقرب لحاجتك، الطبيب بيفحص حالتك وبيشرح الخيارات المناسبة قبل أي إجراء.',
    planNote: 'الفحص والتصوير عند الحاجة بيساعدوا الطبيب يحدد الإجراء والخطة المناسبة.',
    preparationNote:
      'أي صور أو تقارير سابقة قد تساعد الطبيب على فهم الحالة، لكنها مو شرط للبحث عن طبيب.',
  };
}
