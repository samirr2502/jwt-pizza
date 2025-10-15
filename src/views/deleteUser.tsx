import React from 'react';
import { useLocation } from 'react-router-dom';
import { pizzaService } from '../service/service';
import View from './view';
import Button from '../components/button';
import { useBreadcrumb } from '../hooks/appNavigation';

export default function DeleteUser() {
  const state = useLocation().state;
  const navigateToParentPath = useBreadcrumb();

  async function deleteUser() {
    await pizzaService.deleteUser(state.authUser, state.delUser);
    navigateToParentPath();
  }

  return (
    <View title='Deleting user'>
      <div className='text-start py-8 px-4 sm:px-6 lg:px-8'>
        <div className='text-neutral-100'>
          Are you sure you want to delete user <span className='text-orange-500'>{state.delUser.name}</span>. This will delete all user's data and cannot be restored. 
          If user has franchisee, it will be removed as well along with all their stores. All outstanding revenue will not be refunded.
        </div>
        <Button title='Delete' onPress={deleteUser} />
        <Button title='Cancel' onPress={navigateToParentPath} className='bg-transparent border-neutral-300' />
      </div>
    </View>
  );
}
