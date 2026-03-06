import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { styles } from '../../constants/styles';
import { fadeIn } from '../../utils/motion';
import { register } from '../../utils/auth';
import { useToast } from '../../hooks/useToast';

const Register = () => {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.phone || !formData.password || !formData.confirmPassword) {
      setError('请填写所有字段');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    setLoading(true);

    // 注册
    const result = register(formData.phone, formData.password);

    setLoading(false);

    if (result.success) {
      showToast({ message: '注册成功！请登录', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <section className={`relative mx-auto min-h-screen w-full pt-[120px] pb-20`}>
      <ToastContainer />
      <div className={`${styles.padding} relative z-0 mx-auto max-w-7xl`}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          variants={fadeIn('up', 'spring', 0.1, 0.75)}
          className="mx-auto max-w-md"
        >
          <div className="bg-tertiary rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-white text-[32px] font-bold mb-2 text-center">注册账号</h2>
            <p className="text-secondary text-[14px] mb-8 text-center">
              加入芗音同韵，开启您的芗剧文化之旅
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
                  placeholder="请输入11位手机号"
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
                  placeholder="至少6位密码"
                  className="w-full bg-black-100 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-[#915EFF] focus:outline-none transition-colors placeholder:text-secondary/50"
                />
              </div>

              {/* 确认密码 */}
              <div>
                <label className="block text-white text-[14px] font-medium mb-2">
                  确认密码
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="请再次输入密码"
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
                {loading ? '注册中...' : '注册'}
              </button>

              {/* 登录链接 */}
              <div className="text-center">
                <p className="text-secondary text-[14px]">
                  已有账号？
                  <Link to="/login" className="text-[#915EFF] hover:text-[#7c3aed] ml-1">
                    立即登录
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* 注册说明 */}
          <motion.div
            variants={fadeIn('up', 'spring', 0.2, 0.75)}
            className="mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/20"
          >
            <p className="text-secondary text-[13px] leading-relaxed">
              <span className="text-[#e3d7b1] font-semibold">温馨提示：</span>
              注册成功后，系统将为您自动生成昵称（用户+手机尾号），您可以在个人中心修改昵称、性别、生日等个人信息。
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#915EFF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Register;
