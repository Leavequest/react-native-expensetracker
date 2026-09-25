import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { UserProvider, useUser } from '../src/context/UserContext';

const TestUserConsumer: React.FC<{
  onState: (state: ReturnType<typeof useUser>) => void;
}> = ({ onState }) => {
  const userState = useUser();
  React.useEffect(() => {
    onState(userState);
  });
  return null;
};

describe('UserContext', () => {
  it('provides default active user and allows adding a user', async () => {
    let captured: ReturnType<typeof useUser> | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <UserProvider>
          <TestUserConsumer onState={s => (captured = s)} />
        </UserProvider>
      );
    });

    expect(captured).toBeDefined();
    expect(captured!.householdUsers.length).toBe(1);
    expect(captured!.activeUser.id).toBe('u1');

    // Add a second user
    await ReactTestRenderer.act(() => {
      captured!.addUser('Elena', 'elena@example.com');
    });

    expect(captured!.householdUsers.length).toBe(2);
    expect(captured!.householdUsers[1].name).toBe('Elena');
  });

  it('deletes a non-active user correctly', async () => {
    let captured: ReturnType<typeof useUser> | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <UserProvider>
          <TestUserConsumer onState={s => (captured = s)} />
        </UserProvider>
      );
    });

    let newUserId = '';
    await ReactTestRenderer.act(() => {
      const added = captured!.addUser('Marco', 'marco@example.com');
      newUserId = added.id;
    });

    expect(captured!.householdUsers.length).toBe(2);

    await ReactTestRenderer.act(() => {
      captured!.deleteUser(newUserId);
    });

    expect(captured!.householdUsers.length).toBe(1);
    expect(captured!.householdUsers.find(u => u.id === newUserId)).toBeUndefined();
  });

  it('never deletes the last remaining household member', async () => {
    let captured: ReturnType<typeof useUser> | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <UserProvider>
          <TestUserConsumer onState={s => (captured = s)} />
        </UserProvider>
      );
    });

    await ReactTestRenderer.act(() => {
      captured!.deleteUser('u1');
    });

    expect(captured!.householdUsers.length).toBe(1);
    expect(captured!.activeUser.id).toBe('u1');
  });

  it('switches active user automatically when active user is deleted', async () => {
    let captured: ReturnType<typeof useUser> | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <UserProvider>
          <TestUserConsumer onState={s => (captured = s)} />
        </UserProvider>
      );
    });

    let secondUserId = '';
    await ReactTestRenderer.act(() => {
      const added = captured!.addUser('Second User', 'second@example.com');
      secondUserId = added.id;
    });

    // Currently u1 is active
    expect(captured!.activeUser.id).toBe('u1');

    // Delete u1
    await ReactTestRenderer.act(() => {
      captured!.deleteUser('u1');
    });

    expect(captured!.householdUsers.length).toBe(1);
    expect(captured!.activeUser.id).toBe(secondUserId);
    expect(captured!.householdUsers[0].isCurrentUser).toBe(true);
  });
});
