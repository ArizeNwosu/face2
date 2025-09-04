import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface VideoRecord {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  downloadUrl?: string;
  thumbnailUrl?: string;
  processingTime?: number;
  fileSize?: number;
  duration?: number;
  errorMessage?: string;
}

export interface CreateVideoData {
  userId: string;
  title: string;
  prompt: string;
  status?: 'processing';
}

export interface UpdateVideoData {
  status?: 'completed' | 'failed';
  downloadUrl?: string;
  thumbnailUrl?: string;
  processingTime?: number;
  fileSize?: number;
  duration?: number;
  errorMessage?: string;
}

class VideoService {
  private videosCollection = collection(db, 'videos');

  async createVideo(data: CreateVideoData): Promise<string> {
    try {
      const videoData = {
        ...data,
        status: 'processing' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(this.videosCollection, videoData);
      console.log('Video record created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating video record:', error);
      throw error;
    }
  }

  async updateVideo(videoId: string, data: UpdateVideoData): Promise<void> {
    try {
      const videoRef = doc(this.videosCollection, videoId);
      
      // Filter out undefined values to avoid Firestore errors
      const cleanData: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          cleanData[key] = value;
        }
      });
      
      const updateData = {
        ...cleanData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(videoRef, updateData);
      console.log('Video record updated:', videoId);
    } catch (error) {
      console.error('Error updating video record:', error);
      throw error;
    }
  }

  async getUserVideos(userId: string): Promise<VideoRecord[]> {
    try {
      const q = query(
        this.videosCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const videos: VideoRecord[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        videos.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          prompt: data.prompt,
          status: data.status,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          downloadUrl: data.downloadUrl,
          thumbnailUrl: data.thumbnailUrl,
          processingTime: data.processingTime,
          fileSize: data.fileSize,
          duration: data.duration,
          errorMessage: data.errorMessage,
        });
      });

      return videos;
    } catch (error) {
      console.error('Error fetching user videos:', error);
      throw error;
    }
  }

  async markVideoAsCompleted(
    videoId: string, 
    downloadUrl: string, 
    thumbnailUrl?: string,
    processingTime?: number,
    fileSize?: number,
    duration?: number
  ): Promise<void> {
    return this.updateVideo(videoId, {
      status: 'completed',
      downloadUrl,
      thumbnailUrl,
      processingTime,
      fileSize,
      duration,
    });
  }

  async markVideoAsFailed(videoId: string, errorMessage: string): Promise<void> {
    return this.updateVideo(videoId, {
      status: 'failed',
      errorMessage,
    });
  }

  formatVideoForDisplay(video: VideoRecord) {
    return {
      id: video.id,
      title: video.title,
      createdAt: video.createdAt.toDate().toISOString(),
      status: video.status,
      downloadUrl: video.downloadUrl,
      thumbnailUrl: video.thumbnailUrl,
      processingTime: video.processingTime,
      fileSize: video.fileSize,
      duration: video.duration,
      errorMessage: video.errorMessage,
    };
  }
}

export const videoService = new VideoService();