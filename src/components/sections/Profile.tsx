import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { styles } from '../../constants/styles';
import { fadeIn } from '../../utils/motion';
import { getCurrentUser, updateUser, logout, getWatchHistory, clearWatchHistory } from '../../utils/auth';
import type { User, WatchHistory } from '../../types/user';
import { useToast } from '../../hooks/useToast';

// 获取封面图片的函数（与 VideoClips 保持一致）
const getCoverImage = (seriesName: string): string => {
  // 参数检查
  if (!seriesName) {
    return '';
  }

  const coverMap: { [key: string]: string } = {
    '三凤求凰': 'http://xyty.site/封面/三凤求凰.png',
    '李三娘': 'http://xyty.site/封面/李三娘.png',
    '杨戬救母': 'http://xyty.site/封面/杨戬救母.png',
    '红楼梦-黛玉葬花': 'http://xyty.site/封面/黛玉葬花.png',
    '杨丽花芗剧－红楼梦-黛玉葬花': 'http://xyty.site/封面/黛玉葬花.png',
  };
  
  // 尝试精确匹配
  if (coverMap[seriesName]) {
    return coverMap[seriesName];
  }
  
  // 尝试模糊匹配
  for (const [key, value] of Object.entries(coverMap)) {
    if (seriesName.includes(key) || key.includes(seriesName)) {
      return value;
    }
  }
  
  // 默认封面（如果没有匹配的）
  return '';
};

const Profile = () => {
  const navigate = useNavigate();
  const { showToast, showConfirm, ToastContainer } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: '',
    gender: '' as '' | 'male' | 'female' | 'other',
    birthday: '',
  });

  // 计算学习数据
  const calculateStats = () => {
    if (!user) return { days: 0, videos: 0, series: 0, todayMinutes: 0, consecutiveDays: 1 };
    
    const days = Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const videos = watchHistory.length;
    const series = new Set(watchHistory.map(h => h.seriesName)).size;
    const todayMinutes = Math.min(videos * 8, 120);
    const consecutiveDays = Math.min(days, 7);
    
    return { days, videos, series, todayMinutes, consecutiveDays };
  };

  // 计算经验值和等级
  const calculateLevel = () => {
    const videos = watchHistory.length;
    const experience = videos * 100;
    const maxExp = 100000;
    const progress = Math.min((experience / maxExp) * 100, 100);
    
    return { experience, maxExp, progress };
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setEditForm({
      nickname: currentUser.nickname,
      gender: currentUser.gender || '',
      birthday: currentUser.birthday || '',
    });

    const history = getWatchHistory(currentUser.phone);
    setWatchHistory(history);
  }, [navigate]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (!user) return;

    const success = updateUser(user.phone, editForm);

    if (success) {
      const updatedUser = getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
      setShowEditModal(false);
      showToast({ message: '保存成功', type: 'success' });
    } else {
      showToast({ message: '保存失败', type: 'error' });
    }
  };

  const handleOpenEditModal = () => {
    if (!user) return;
    setEditForm({
      nickname: user.nickname,
      gender: user.gender || '',
      birthday: user.birthday || '',
    });
    setShowEditModal(true);
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: '退出登录',
      message: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
      confirmType: 'danger',
    });

    if (confirmed) {
      logout();
      navigate('/');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return null;
  }

  const stats = calculateStats();
  const levelInfo = calculateLevel();

  return (
    <section className={`relative mx-auto min-h-screen w-full pt-[80px] pb-20 bg-[#0a0e1a]`}>
      <ToastContainer />
      
      {/* 顶部标题 */}
      <div className="text-center mb-8 pt-8">
        <h1 className="text-[#e3d7b1] text-[32px] font-bold mb-2">数字戏文化中心</h1>
        <p className="text-secondary text-[13px]">探索传统戏曲艺术 · 感受数字文化魅力</p>
      </div>

      <div className={`${styles.paddingX} mx-auto max-w-7xl`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 左侧：用户信息卡片 */}
          <div className="lg:col-span-1">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeIn('right', 'spring', 0.1, 0.75)}
              className="bg-[#1a1f35] rounded-2xl p-8 border border-[#2a3350]"
            >
              {/* 头像和昵称 */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#915EFF] to-[#7c3aed] flex items-center justify-center text-white text-[28px] font-bold mb-4 ring-2 ring-purple-500/30">
                  {user.nickname.slice(-2)}
                </div>
                <h2 className="text-white text-[20px] font-bold mb-3">{user.nickname}</h2>
                
                {/* 等级徽章 */}
                <div className="px-4 py-1.5 bg-gradient-to-r from-[#915EFF] to-[#7c3aed] rounded-full text-white text-[12px] font-semibold mb-6">
                  探索者
                </div>
                
                {/* 经验值进度条 */}
                <div className="w-full">
                  <div className="flex justify-between text-[11px] text-secondary mb-2">
                    <span>{levelInfo.experience.toLocaleString()}</span>
                    <span>{levelInfo.maxExp.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0f1420] rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#f97316] transition-all duration-500"
                      style={{ width: `${levelInfo.progress}%` }}
                    />
                  </div>
                  <div className="text-center text-[11px] text-secondary">已获经验</div>
                </div>
              </div>

              {/* 编辑按钮 */}
              <button
                onClick={handleOpenEditModal}
                className="w-full px-4 py-2.5 bg-[#2a3350] text-white rounded-lg hover:bg-[#343d5a] transition-colors text-[13px] font-medium"
              >
                编辑个人资料
              </button>
            </motion.div>
          </div>

          {/* 右侧内容区 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 学习面板 */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeIn('left', 'spring', 0.15, 0.75)}
              className="bg-[#1a1f35] rounded-2xl p-6 border border-[#2a3350]"
            >
              <h3 className="text-white text-[16px] font-bold mb-4">学习面板</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 今日学习 */}
                <div className="text-center">
                  <div className="text-[40px] mb-1">📚</div>
                  <div className="text-secondary text-[11px] mb-1">今日学习</div>
                  <div className="text-white text-[24px] font-bold">{stats.todayMinutes}</div>
                  <div className="text-secondary text-[11px]">分钟</div>
                </div>
                
                {/* 连续签到 */}
                <div className="text-center">
                  <div className="text-[40px] mb-1">📅</div>
                  <div className="text-secondary text-[11px] mb-1">连续签到</div>
                  <div className="text-white text-[24px] font-bold">{stats.consecutiveDays}</div>
                  <div className="text-secondary text-[11px]">天</div>
                </div>
                
                {/* 已学视频 */}
                <div className="text-center">
                  <div className="text-[40px] mb-1">🎬</div>
                  <div className="text-secondary text-[11px] mb-1">已学视频</div>
                  <div className="text-white text-[24px] font-bold">{stats.videos}</div>
                  <div className="text-secondary text-[11px]">个</div>
                </div>
                
                {/* 学习天数 */}
                <div className="text-center">
                  <div className="text-[40px] mb-1">⏰</div>
                  <div className="text-secondary text-[11px] mb-1">学习天数</div>
                  <div className="text-white text-[24px] font-bold">{stats.days}</div>
                  <div className="text-secondary text-[11px]">天</div>
                </div>
              </div>
            </motion.div>

            {/* 成就板块 */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeIn('left', 'spring', 0.2, 0.75)}
              className="bg-[#1a1f35] rounded-2xl p-6 border border-[#2a3350]"
            >
              <h3 className="text-white text-[16px] font-bold mb-4">成就板块</h3>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-secondary text-[11px] mb-1">最近成就</div>
                      <div className="text-[#e3d7b1] text-[14px] font-semibold">
                        {stats.videos > 0 ? '初窥门径' : '暂无成就'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-secondary text-[11px] mb-1">闪耀徽章</div>
                      <div className="text-[#e3d7b1] text-[14px] font-semibold">
                        {Math.floor(stats.videos / 5)}
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/culture')}
                  className="px-6 py-2 bg-[#2a3350] text-white rounded-lg hover:bg-[#343d5a] transition-colors text-[12px] font-medium"
                >
                  开始探索
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 底部两栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* 情景体验记录 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeIn('up', 'spring', 0.25, 0.75)}
            className="bg-[#1a1f35] rounded-2xl p-6 border border-[#2a3350]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-[16px] font-bold">情景体验记录</h3>
              <span className="text-secondary text-[12px]">共 1 个体验</span>
            </div>
            
            <div className="text-center py-12 text-secondary text-[13px]">
              情景体验功能即将上线，敬请期待...
            </div>
          </motion.div>

          {/* 视频观看记录 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeIn('up', 'spring', 0.3, 0.75)}
            className="bg-[#1a1f35] rounded-2xl p-6 border border-[#2a3350]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-[16px] font-bold">视频观看记录</h3>
              <span className="text-secondary text-[12px]">共 {watchHistory.length} 个视频</span>
            </div>
            
            {watchHistory.length === 0 ? (
              <div className="text-center py-12 text-secondary text-[13px]">
                暂无观看记录
              </div>
            ) : (
              <div className="space-y-3">
                {watchHistory.slice(0, 4).map((item, index) => {
                  // 使用 getCoverImage 函数获取封面，如果 item.coverImage 不存在就用剧目名称匹配
                  const coverUrl = item.coverImage || getCoverImage(item.seriesName);
                  
                  return (
                  <div
                    key={index}
                    className="bg-[#0f1420] rounded-lg p-4 border border-[#1a2030] hover:border-[#915EFF]/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* 缩略图 - 直接显示封面图片 */}
                      <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
                        <img 
                          src={coverUrl} 
                          alt={item.seriesName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 信息 */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-[14px] font-medium mb-2 truncate">
                          {item.videoTitle}
                        </h4>
                        
                        {/* 剧目名称 */}
                        <div className="text-[#e3d7b1] text-[12px] mb-2">
                          {item.seriesName}
                        </div>
                        
                        {/* 进度条 */}
                        <div className="w-full h-2 bg-[#1a2030] rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] w-full" />
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#22c55e]">已完成</span>
                          <span className="text-secondary/60">{formatDate(item.watchedAt).split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* 退出登录 */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogout}
            className="px-8 py-2.5 bg-[#1a1f35] text-red-400 border border-red-500/30 rounded-lg hover:bg-red-900/20 transition-colors text-[13px] font-medium"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* 编辑资料模态框 */}
      {showEditModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1f35] rounded-2xl p-8 max-w-md w-full border border-[#2a3350]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-[20px] font-bold mb-6">编辑个人资料</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-secondary text-[13px] mb-2">昵称</label>
                <input
                  type="text"
                  name="nickname"
                  value={editForm.nickname}
                  onChange={handleEditChange}
                  className="w-full bg-[#0f1420] text-white rounded-lg px-4 py-2.5 border border-[#2a3350] focus:border-[#915EFF] focus:outline-none transition-colors text-[13px]"
                  placeholder="请输入昵称"
                />
              </div>

              <div>
                <label className="block text-secondary text-[13px] mb-2">性别</label>
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={handleEditChange}
                  className="w-full bg-[#0f1420] text-white rounded-lg px-4 py-2.5 border border-[#2a3350] focus:border-[#915EFF] focus:outline-none transition-colors text-[13px]"
                >
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-secondary text-[13px] mb-2">生日</label>
                <input
                  type="date"
                  name="birthday"
                  value={editForm.birthday}
                  onChange={handleEditChange}
                  className="w-full bg-[#0f1420] text-white rounded-lg px-4 py-2.5 border border-[#2a3350] focus:border-[#915EFF] focus:outline-none transition-colors text-[13px]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2.5 bg-[#2a3350] text-white rounded-lg hover:bg-[#343d5a] transition-colors text-[13px] font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#915EFF] to-[#7c3aed] text-white rounded-lg hover:opacity-90 transition-opacity text-[13px] font-medium"
              >
                保存
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-[#915EFF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Profile;
