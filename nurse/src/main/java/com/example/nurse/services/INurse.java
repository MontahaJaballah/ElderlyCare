package com.example.nurse.services;


import com.example.nurse.entities.Nurse;

import java.util.List;
import java.util.Optional;

public interface INurse {
    Optional<Nurse> getNurse(int id );
    public List<Nurse> getAllNurses();
    void setNurse(Nurse nurse);
    void addNurse(Nurse nurse);
    void removeNurse(Nurse nurse);
    public List<Nurse> getNursesByName(String name);
    public List<Nurse> getNursesByExperience(int minYears);


}

