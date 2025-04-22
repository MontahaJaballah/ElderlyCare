package com.example.nurse.services;


import com.example.nurse.entities.Nurse;
import com.example.nurse.repositories.NurseRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class NurseService implements INurse {

    NurseRepo nurseRepo;

    @Override
    public Optional<Nurse> getNurse(int id) {
        return nurseRepo.findById(id);
    }

    @Override
    public void setNurse(Nurse nurse) {
     nurseRepo.save(nurse);
    }


    @Override
    public List<Nurse> getAllNurses() {

        return nurseRepo.findAll();

    }

    @Override
    public void addNurse(Nurse nurse) {
        nurseRepo.save(nurse);

    }

    @Override
    public void removeNurse(Nurse nurse) {
        nurseRepo.delete(nurse);

    }

    @Override
    public List<Nurse> getNursesByName(String name) {
        return nurseRepo.searchByName(name);
    }

    public List<Nurse> getNursesByExperience(int minYears) {
        return nurseRepo.findByMinExperience(minYears);
    }

}
