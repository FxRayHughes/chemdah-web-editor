import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { saveQueue } from '@/utils/saveQueue';

/**
 * 文件类型
 */
export type FileType = 'quest' | 'conversation' | 'script' | 'config';

/**
 * 虚拟文件接口
 */
export interface VirtualFile {
  id: string;        // 文件唯一标识
  name: string;      // 文件名
  type: FileType;    // 文件类型
  content: string;   // 文件内容
  path: string;      // 逻辑路径 例如 "core/quest/example.yml"
}

/**
 * 虚拟文件夹接口
 */
export interface VirtualFolder {
  id: string;        // 文件夹唯一标识
  name: string;      // 文件夹名
  path: string;      // 父路径 例如 "core" 或 ""
  type: FileType;    // 文件类型
}

/**
 * 项目状态接口
 */
interface ProjectState {
  // 状态
  questFiles: Record<string, VirtualFile>;              // 任务文件集合
  questFolders: Record<string, VirtualFolder>;          // 任务文件夹集合
  conversationFiles: Record<string, VirtualFile>;       // 对话文件集合
  conversationFolders: Record<string, VirtualFolder>;   // 对话文件夹集合
  activeFileId: string | null;                          // 当前激活的文件 ID
  activeFileType: FileType | null;                      // 当前激活的文件类型

  // 文件操作
  createFile: (name: string, type: FileType, path: string, initialContent?: string) => { success: boolean; message?: string };
  deleteFile: (id: string, type: FileType) => void;
  updateFileContent: (id: string, type: FileType, content: string) => void;
  renameFile: (id: string, type: FileType, newName: string) => void;
  moveFile: (id: string, type: FileType, newPath: string) => { success: boolean; message?: string };

  // 文件夹操作
  createFolder: (name: string, path: string, type: FileType) => void;
  deleteFolder: (id: string, type: FileType) => void;
  renameFolder: (id: string, type: FileType, newName: string) => void;
  moveFolder: (id: string, type: FileType, newPath: string) => { success: boolean; message?: string };

  // 其他操作
  setActiveFile: (id: string | null, type?: FileType) => void;
  importFiles: (files: VirtualFile[]) => void;
}

/**
 * 项目 Store
 * 管理虚拟文件系统和文件状态
 * 使用 Zustand 持久化到 localStorage
 */
export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // 初始状态
      questFiles: {},
      questFolders: {},
      conversationFiles: {},
      conversationFolders: {},
      activeFileId: null,
      activeFileType: null,

      /**
       * 创建新文件
       * @param name 文件名
       * @param type 文件类型
       * @param path 文件路径
       * @param initialContent 初始内容
       * @returns 创建结果
       */
      createFile: (name, type, path, initialContent = '') => {
        const state = get();
        const files = type === 'quest' ? state.questFiles : state.conversationFiles;

        // Check if file exists
        const exists = Object.values(files).some(f => f.name === name && f.path === path);
        if (exists) {
            return { success: false, message: `File '${name}' already exists in '${path || 'root'}'` };
        }

        set((state) => {
            const id = uuidv4();
            const newFile = { id, name, type, path, content: initialContent };

            if (type === 'quest') {
            return {
                questFiles: { ...state.questFiles, [id]: newFile },
                activeFileId: id,
                activeFileType: type
            };
            } else {
            return {
                conversationFiles: { ...state.conversationFiles, [id]: newFile },
                activeFileId: id,
                activeFileType: type
            };
            }
        });
        return { success: true };
      },

      /**
       * 删除文件
       * @param id 文件 ID
       * @param type 文件类型
       */
      deleteFile: (id, type) => set((state) => {
        if (type === 'quest') {
          const newFiles = { ...state.questFiles };
          delete newFiles[id];
          return {
            questFiles: newFiles,
            activeFileId: state.activeFileId === id ? null : state.activeFileId,
            activeFileType: state.activeFileId === id ? null : state.activeFileType
          };
        } else {
          const newFiles = { ...state.conversationFiles };
          delete newFiles[id];
          return {
            conversationFiles: newFiles,
            activeFileId: state.activeFileId === id ? null : state.activeFileId,
            activeFileType: state.activeFileId === id ? null : state.activeFileType
          };
        }
      }),

      /**
       * 更新文件内容
       * @param id 文件 ID
       * @param type 文件类型
       * @param content 新的文件内容
       */
      updateFileContent: (id, type, content) => set((state) => {
        if (type === 'quest') {
          return {
            questFiles: {
              ...state.questFiles,
              [id]: { ...state.questFiles[id], content }
            }
          };
        } else {
          return {
            conversationFiles: {
              ...state.conversationFiles,
              [id]: { ...state.conversationFiles[id], content }
            }
          };
        }
      }),

      /**
       * 重命名文件
       * @param id 文件 ID
       * @param type 文件类型
       * @param newName 新文件名
       */
      renameFile: (id, type, newName) => set((state) => {
        if (type === 'quest') {
          return {
            questFiles: {
              ...state.questFiles,
              [id]: { ...state.questFiles[id], name: newName }
            }
          };
        } else {
          return {
            conversationFiles: {
              ...state.conversationFiles,
              [id]: { ...state.conversationFiles[id], name: newName }
            }
          };
        }
      }),

      /**
       * 移动文件到新路径
       * @param id 文件 ID
       * @param type 文件类型
       * @param newPath 新的路径
       * @returns 移动结果
       */
      moveFile: (id, type, newPath) => {
        const state = get();
        const files = type === 'quest' ? state.questFiles : state.conversationFiles;
        const file = files[id];

        if (!file) return { success: false, message: 'File not found' };

        // Normalize paths (remove trailing slashes)
        const normalizedNewPath = newPath.replace(/\/+$/, '');
        const normalizedCurrentPath = file.path.replace(/\/+$/, '');

        if (normalizedCurrentPath === normalizedNewPath) {
            return { success: false, message: `File is already in '${normalizedNewPath || 'root'}'` };
        }

        // Check if file with same name exists in destination
        const exists = Object.values(files).some(f => f.id !== id && f.name === file.name && f.path === normalizedNewPath);
        if (exists) {
            return { success: false, message: `File '${file.name}' already exists in '${normalizedNewPath || 'root'}'` };
        }

        set((state) => {
          if (type === 'quest') {
            return {
                questFiles: {
                    ...state.questFiles,
                    [id]: { ...state.questFiles[id], path: normalizedNewPath }
                }
            };
          } else {
            return {
                conversationFiles: {
                    ...state.conversationFiles,
                    [id]: { ...state.conversationFiles[id], path: normalizedNewPath }
                }
            };
          }
        });
        return { success: true };
      },

      /**
       * 创建新文件夹
       * @param name 文件夹名
       * @param path 父路径
       * @param type 文件类型
       */
      createFolder: (name, path, type) => set((state) => {
        const id = uuidv4();
        const newFolder = { id, name, path, type };

        if (type === 'quest') {
          return {
            questFolders: { ...state.questFolders, [id]: newFolder }
          };
        } else {
          return {
            conversationFolders: { ...state.conversationFolders, [id]: newFolder }
          };
        }
      }),

      /**
       * 删除文件夹
       * @param id 文件夹 ID
       * @param type 文件类型
       */
      deleteFolder: (id, type) => set((state) => {
        if (type === 'quest') {
          const newFolders = { ...state.questFolders };
          delete newFolders[id];
          return { questFolders: newFolders };
        } else {
          const newFolders = { ...state.conversationFolders };
          delete newFolders[id];
          return { conversationFolders: newFolders };
        }
      }),

      /**
       * 重命名文件夹
       * @param id 文件夹 ID
       * @param type 文件类型
       * @param newName 新文件夹名
       */
      renameFolder: (id, type, newName) => set((state) => {
        const folders = type === 'quest' ? state.questFolders : state.conversationFolders;
        const folder = folders[id];
        if (!folder) return state;

        const oldPath = folder.path ? `${folder.path}/${folder.name}` : folder.name;
        const newPath = folder.path ? `${folder.path}/${newName}` : newName;

        if (type === 'quest') {
            const newFolders = { ...state.questFolders, [id]: { ...folder, name: newName } };
            const newFiles = { ...state.questFiles };

            // Update files
            Object.values(newFiles).forEach(file => {
                if (file.path === oldPath) {
                    newFiles[file.id] = { ...file, path: newPath };
                } else if (file.path.startsWith(oldPath + '/')) {
                    newFiles[file.id] = { ...file, path: file.path.replace(oldPath, newPath) };
                }
            });

            // Update folders
            Object.values(newFolders).forEach(f => {
                if (f.id === id) return;
                if (f.path === oldPath) {
                    newFolders[f.id] = { ...f, path: newPath };
                } else if (f.path.startsWith(oldPath + '/')) {
                    newFolders[f.id] = { ...f, path: f.path.replace(oldPath, newPath) };
                }
            });
            return { questFiles: newFiles, questFolders: newFolders };
        } else {
            const newFolders = { ...state.conversationFolders, [id]: { ...folder, name: newName } };
            const newFiles = { ...state.conversationFiles };

            // Update files
            Object.values(newFiles).forEach(file => {
                if (file.path === oldPath) {
                    newFiles[file.id] = { ...file, path: newPath };
                } else if (file.path.startsWith(oldPath + '/')) {
                    newFiles[file.id] = { ...file, path: file.path.replace(oldPath, newPath) };
                }
            });

            // Update folders
            Object.values(newFolders).forEach(f => {
                if (f.id === id) return;
                if (f.path === oldPath) {
                    newFolders[f.id] = { ...f, path: newPath };
                } else if (f.path.startsWith(oldPath + '/')) {
                    newFolders[f.id] = { ...f, path: f.path.replace(oldPath, newPath) };
                }
            });
            return { conversationFiles: newFiles, conversationFolders: newFolders };
        }
      }),

      /**
       * 移动文件夹到新路径
       * @param id 文件夹 ID
       * @param type 文件类型
       * @param newPath 新的父路径
       * @returns 移动结果
       */
      moveFolder: (id, type, newPath) => {
        const state = get();
        const folders = type === 'quest' ? state.questFolders : state.conversationFolders;

        // 1. Determine old path and folder name
        let oldPath = '';
        let folderName = '';
        const folder = folders[id];

        if (folder) {
            // Explicit folder
            oldPath = folder.path ? `${folder.path}/${folder.name}` : folder.name;
            folderName = folder.name;
        } else if (id.startsWith('folder-')) {
            // Implicit folder
            oldPath = id.replace('folder-', '');
            const parts = oldPath.split('/');
            folderName = parts[parts.length - 1];
        } else {
            return { success: false, message: 'Folder not found' };
        }

        // 2. Check if moving to same location
        const currentParentPath = oldPath.includes('/') ? oldPath.substring(0, oldPath.lastIndexOf('/')) : '';

        // Normalize paths
        const normalizedNewPath = newPath.replace(/\/+$/, '');
        const normalizedCurrentParentPath = currentParentPath.replace(/\/+$/, '');

        if (normalizedNewPath === normalizedCurrentParentPath) {
            return { success: false, message: `Folder '${folderName}' is already in '${normalizedNewPath || 'root'}'` };
        }

        // 3. Check for circular dependency
        if (normalizedNewPath === oldPath || normalizedNewPath.startsWith(oldPath + '/')) {
            return { success: false, message: `Cannot move folder '${folderName}' into itself or its children` };
        }

        const newFolderPath = normalizedNewPath ? `${normalizedNewPath}/${folderName}` : folderName;

        set((state) => {
            if (type === 'quest') {
                const newFolders = { ...state.questFolders };
                const newFiles = { ...state.questFiles };

                if (folder) {
                    newFolders[id] = { ...folder, path: normalizedNewPath };
                }

                Object.values(newFiles).forEach(file => {
                    if (file.path === oldPath) {
                        newFiles[file.id] = { ...file, path: newFolderPath };
                    } else if (file.path.startsWith(oldPath + '/')) {
                        newFiles[file.id] = { ...file, path: file.path.replace(oldPath, newFolderPath) };
                    }
                });

                Object.values(newFolders).forEach(f => {
                    if (f.id === id) return;
                    if (f.path === oldPath) {
                        newFolders[f.id] = { ...f, path: newFolderPath };
                    } else if (f.path.startsWith(oldPath + '/')) {
                        newFolders[f.id] = { ...f, path: f.path.replace(oldPath, newFolderPath) };
                    }
                });

                return { questFiles: newFiles, questFolders: newFolders };
            } else {
                const newFolders = { ...state.conversationFolders };
                const newFiles = { ...state.conversationFiles };

                if (folder) {
                    newFolders[id] = { ...folder, path: normalizedNewPath };
                }

                Object.values(newFiles).forEach(file => {
                    if (file.path === oldPath) {
                        newFiles[file.id] = { ...file, path: newFolderPath };
                    } else if (file.path.startsWith(oldPath + '/')) {
                        newFiles[file.id] = { ...file, path: file.path.replace(oldPath, newFolderPath) };
                    }
                });

                Object.values(newFolders).forEach(f => {
                    if (f.id === id) return;
                    if (f.path === oldPath) {
                        newFolders[f.id] = { ...f, path: newFolderPath };
                    } else if (f.path.startsWith(oldPath + '/')) {
                        newFolders[f.id] = { ...f, path: f.path.replace(oldPath, newFolderPath) };
                    }
                });

                return { conversationFiles: newFiles, conversationFolders: newFolders };
            }
        });

        return { success: true };
      },

      /**
       * 设置当前激活的文件
       * @param id 文件 ID
       * @param type 文件类型（可选）
       */
      setActiveFile: (id, type) => set((state) => ({
        activeFileId: id,
        activeFileType: type || (id ? state.activeFileType : null)
      })),

      /**
       * 批量导入文件
       * @param newFiles 要导入的文件数组
       */
      importFiles: (newFiles) => set((state) => {
        const newQuestFiles = { ...state.questFiles };
        const newConversationFiles = { ...state.conversationFiles };

        newFiles.forEach(f => {
            if (f.type === 'quest') {
                newQuestFiles[f.id] = f;
            } else {
                newConversationFiles[f.id] = f;
            }
        });

        return {
          questFiles: newQuestFiles,
          conversationFiles: newConversationFiles,
          activeFileId: newFiles.length > 0 ? newFiles[0].id : state.activeFileId,
          activeFileType: newFiles.length > 0 ? newFiles[0].type : state.activeFileType
        };
      })
    }),
    {
      // Zustand 持久化配置
      name: 'chemdah-project-storage',
      skipHydration: false,

      // 使用异步保存队列，避免频繁的同步 localStorage 操作阻塞主线程
      storage: {
        /**
         * 从 localStorage 读取数据
         */
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },

        /**
         * 保存数据到 localStorage
         * 使用 800ms 防抖 + 异步保存队列，避免频繁保存阻塞主线程
         */
        setItem: (() => {
          let timer: number | null = null;
          return (name: string, value: any) => {
            // 防抖 800ms
            if (timer) clearTimeout(timer);
            timer = window.setTimeout(() => {
              // 使用保存队列异步保存，不阻塞主线程
              // saveQueue 会自动进行深度克隆，避免引用问题
              saveQueue.enqueue(name, { state: value });
              timer = null;
            }, 1000);
          };
        })(),

        /**
         * 从 localStorage 删除数据
         */
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
