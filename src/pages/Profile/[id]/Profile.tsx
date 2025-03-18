import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStudentById, getEmployeeById, getParentById } from '../../../api/api-utils';
import { RootState } from '../../../store';
import { StudentDetails, EmployeeDetails, ParentDetails } from '../../../types';
import { StudentProfile, ParentProfile, EmployeeProfile } from '../../../components';
import styles from './Profile.module.scss';

type ProfileData = StudentDetails | EmployeeDetails | ParentDetails | null;

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const roleId = location.state?.role;
  const { accessToken } = useSelector((state: RootState) => state.user);
  const [profile, setProfile] = useState<ProfileData>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch different data based on the role
        if (roleId === 2 || roleId === 1) { // Employee/Teacher
          const employeeData = await getEmployeeById(id, accessToken);
          setProfile(employeeData);
        } else if (roleId === 4) { // Parent
          const parentData = await getParentById(id, accessToken);
          setProfile(parentData);
        } else { // Default to student (roleId === 3)
          const studentData = await getStudentById(id, accessToken);
          setProfile(studentData);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Ошибка при загрузке данных профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, roleId, accessToken]);

  // Type guards to determine profile type
  const isStudentProfile = (profile: ProfileData): profile is StudentDetails => {
    return profile !== null && 'student' in profile;
  };
  
  const isEmployeeProfile = (profile: ProfileData): profile is EmployeeDetails => {
    return profile !== null && 'position' in profile && 'role' in profile && !('parentType' in profile);
  };

  const isParentProfile = (profile: ProfileData): profile is ParentDetails => {
    return profile !== null && 'parentType' in profile;
  };

  if (loading) {
    return (
      <div className={styles.profile__loading}>
        <div className={styles.profile__loadingSpinner}/>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profile}>
        <p className={styles.profile__error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      {profile ? (
        isStudentProfile(profile) ? (
          <StudentProfile profile={profile} />
        ) : isEmployeeProfile(profile) ? (
          <EmployeeProfile profile={profile} />
        ) : isParentProfile(profile) ? (
          <ParentProfile profile={profile} />
        ) : (
          <p>Unknown profile type</p>
        )
      ) : (
        <p>No profile data available</p>
      )}
    </div>
  );
};
