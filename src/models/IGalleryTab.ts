import { IMyGallery } from './IMyGallery';

export default interface IGalleryTab {
  label: string;
  cont: number;
  contLabel: string;
  btnIndex: number;
  maxPages: number;
  currentPage: number;
  loadingData: boolean;
  loadingButtons?: boolean;
  data: IMyGallery[];
  noData: boolean;
  reloadInterval?: ReturnType<typeof setInterval> | number;
}