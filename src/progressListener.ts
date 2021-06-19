export interface ProgressUpdateFunc {
    (min: number, max: number, progress: number, estimatedDownloadTime: number): void;
}

