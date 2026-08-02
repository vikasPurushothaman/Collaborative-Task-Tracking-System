import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateUser } from '../../store/slices/authSlice';
import { userService } from '../../services/userService';
import { Avatar } from '../../components/ui/index';
import { Camera, Save } from 'lucide-react';
import { TIMEZONE_OPTIONS } from '../../constants';

const schema = z.object({
  name: z.string().min(2),
  title: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().max(200).optional(),
  timezone: z.string().optional(),
});

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name, title: user?.title, department: user?.department, phone: user?.phone, bio: user?.bio, timezone: user?.timezone },
  });

  const onSubmit = async (data) => {
    try {
      const res = await userService.update(user.id, data);
      dispatch(updateUser(res.data));
      toast.success('Profile updated!');
      navigate('/profile');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-5">Edit Profile</h1>
      <div className="card p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={user?.avatar} name={user?.name} size="lg" />
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-700 transition-colors" id="avatar-upload-btn">
              <Camera size={12} />
              <input type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files[0]; if (f) { const r = await userService.uploadAvatar(user.id, f); dispatch(updateUser({ avatar: r.data.avatar })); toast.success('Avatar updated!'); } }} />
            </label>
          </div>
          <div>
            <p className="font-medium text-surface-900 dark:text-surface-100">{user?.name}</p>
            <p className="text-xs text-surface-400">Click the camera to change your photo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="label">Full Name *</label>
              <input {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`} id="edit-name" />
              {errors.name && <p className="text-xs text-danger-500 mt-1">{errors.name.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">Job Title</label>
              <input {...register('title')} className="input" id="edit-title" placeholder="e.g. Senior Developer" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">Department</label>
              <input {...register('department')} className="input" id="edit-department" placeholder="e.g. Engineering" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">Phone</label>
              <input {...register('phone')} className="input" id="edit-phone" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="col-span-2">
              <label className="label">Bio <span className="text-xs text-surface-400">(max 200 chars)</span></label>
              <textarea {...register('bio')} rows={3} className="input resize-none" id="edit-bio" placeholder="Tell your team a bit about yourself..." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">Timezone</label>
              <select {...register('timezone')} className="input" id="edit-timezone">
                {TIMEZONE_OPTIONS.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => navigate('/profile')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary gap-2" id="save-profile-btn">
              <Save size={14} />{isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
