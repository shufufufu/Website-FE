import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { styles } from '../../constants/styles';
import { fadeIn } from '../../utils/motion';
import { login } from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证
    if (!formData.phone || !formData.password) {
      setError('请填写所有字段');
      return;
    }

    setLoading(true);

    // 登录
    const result = login(formData.phone, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
    }
  };

  return (
    <section className={`relative mx-auto min-h-screen w-full pt-[120px] pb-20`}>
      <div className={`${styles.padding} relative z-0 mx-auto max-w-7xl`}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          variants={fadeIn('up', 'spring', 0.1, 0.75)}
          className="mx-auto max-w-md"
        >
          <div className="bg-tertiary rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-white text-[32px] font-bold mb-2 text-center">欢迎回来</h2>
            <p className="text-secondary text-[14px] mb-8 text-center">
              登录您的账号，继续探索芗剧文化
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 手机号 */}
              <div>
                <label className="block text-white text-[14px] font-medium mb-2">
                  手机号
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="请输入手机号"
                  maxLength={11}
                  className="w-full bg-black-100 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-[#915EFF] focus:outline-none transition-colors placeholder:text-secondary/50"
                />
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-white text-[14px] font-medium mb-2">
                  密码
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请输入密码"
                  className="w-full bg-black-100 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-[#915EFF] focus:outline-none transition-colors placeholder:text-secondary/50"
                />
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-[14px]">{error}</p>
                </div>
              )}

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#915EFF] to-[#7c3aed] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? '登录中...' : '登录'}
              </button>

              {/* 注册链接 */}
              <div className="text-center">
                <p className="text-secondary text-[14px]">
                  还没有账号？
                  <Link to="/register" className="text-[#915EFF] hover:text-[#7c3aed] ml-1">
                    立即注册
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* 快速体验提示 */}
          <motion.div
            variants={fadeIn('up', 'spring', 0.2, 0.75)}
            className="mt-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-500/20"
          >
            <p className="text-secondary text-[13px] leading-relaxed">
              <span className="text-[#e3d7b1] font-semibold">💡 提示：</span>
              登录后您可以查看观看历史、管理个人信息，享受更完整的芗剧文化体验。
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#915EFF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Login;
