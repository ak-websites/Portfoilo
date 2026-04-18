import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Trash2, Shield, User, ShieldAlert, Loader2 } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm("Permanently remove this user record?")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center gap-6">
      <Loader2 className="animate-spin text-primary w-10 h-10" />
      <span className="text-xs font-black uppercase tracking-[0.5em] text-muted-foreground">Accessing User Directory...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-10 border-b border-border pb-8">User Terminal</h3>
      
      <div className="grid gap-4">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="p-8 bg-accent/20 border border-border rounded-2xl flex items-center justify-between group transition-all hover:bg-accent/30"
          >
            <div className="flex items-center gap-8">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${user.role === 'admin' ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-background text-muted-foreground border-border'}`}>
                {user.role === 'admin' ? <Shield size={24} /> : <User size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black tracking-tight text-foreground">{user.email}</span>
                  {user.role === 'admin' && (
                    <span className="text-[10px] bg-primary text-primary-foreground px-3 py-1 rounded-full font-black uppercase tracking-widest">Administrator</span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground font-black tracking-widest mt-1 opacity-50 uppercase">UUID: {user.id}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => toggleRole(user.id, user.role)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all border ${
                  user.role === 'admin' 
                    ? 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive hover:text-white' 
                    : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {user.role === 'admin' ? <ShieldAlert size={16} /> : <Shield size={16} />}
                {user.role === 'admin' ? 'Demote Access' : 'Grant Admin'}
              </button>
              
              <button 
                onClick={() => deleteUser(user.id)}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all border border-destructive/10"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-32 bg-background border border-border border-dashed rounded-[3rem]">
          <p className="text-muted-foreground text-xs uppercase font-black tracking-[0.5em] opacity-30">Identity database empty</p>
        </div>
      )}
    </div>
  );
}
